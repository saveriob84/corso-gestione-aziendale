import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import CompanyFormDialog from './CompanyFormDialog';
import { useParticipantActions } from '@/hooks/useParticipantActions';

interface ParticipantFormValues {
  id?: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  luogoNascita: string;
  dataNascita: Date | undefined;
  username: string;
  password: string;
  cellulare: string;
  aziendaId: string;
  exLege: boolean;
  titoloStudio: string;
  ccnl: string;
  contratto: string;
  qualifica: string;
  annoAssunzione: string;
}

interface ParticipantFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ParticipantFormValues>;
  isEditing?: boolean;
}

interface Company {
  id: string;
  ragioneSociale: string;
  partitaIva: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
  telefono: string;
  email: string;
  referente: string;
  codiceAteco: string;
}

const parseDateIfNeeded = (dateValue: any): Date | undefined => {
  if (!dateValue) return undefined;
  
  if (dateValue instanceof Date) return dateValue;
  
  if (typeof dateValue === 'string') {
    const formats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy'];
    
    for (const dateFormat of formats) {
      const parsedDate = parse(dateValue, dateFormat, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    
    const timestamp = Date.parse(dateValue);
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
  }
  
  return undefined;
};

const ParticipantFormDialog: React.FC<ParticipantFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false
}) => {
  const { id: courseId } = useParams();
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [corso, setCorso] = useState<any>(null);
  
  const { updateParticipantGlobally } = useParticipantActions(
    courseId || '', 
    corso, 
    setCorso
  );

  useEffect(() => {
    if (courseId) {
      const courses = JSON.parse(localStorage.getItem('courses') || '[]');
      const currentCourse = courses.find((c: any) => c.id === courseId);
      if (currentCourse) {
        setCorso(currentCourse);
      }
    }
  }, [courseId]);
  
  const formattedInitialData = {
    ...initialData,
    dataNascita: parseDateIfNeeded(initialData?.dataNascita),
    exLege: Boolean(initialData?.exLege)
  };
  
  useEffect(() => {
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, [isCompanyFormOpen]);
  
  const form = useForm<ParticipantFormValues>({
    defaultValues: {
      nome: formattedInitialData?.nome || "",
      cognome: formattedInitialData?.cognome || "",
      codiceFiscale: formattedInitialData?.codiceFiscale || "",
      luogoNascita: formattedInitialData?.luogoNascita || "",
      dataNascita: formattedInitialData?.dataNascita,
      username: formattedInitialData?.username || "",
      password: formattedInitialData?.password || "",
      cellulare: formattedInitialData?.cellulare || "",
      aziendaId: formattedInitialData?.aziendaId || "",
      exLege: formattedInitialData?.exLege || false,
      titoloStudio: formattedInitialData?.titoloStudio || "",
      ccnl: formattedInitialData?.ccnl || "",
      contratto: formattedInitialData?.contratto || "",
      qualifica: formattedInitialData?.qualifica || "",
      annoAssunzione: formattedInitialData?.annoAssunzione || new Date().getFullYear().toString(),
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        nome: initialData?.nome || "",
        cognome: initialData?.cognome || "",
        codiceFiscale: initialData?.codiceFiscale || "",
        luogoNascita: initialData?.luogoNascita || "",
        dataNascita: parseDateIfNeeded(initialData?.dataNascita),
        username: initialData?.username || "",
        password: initialData?.password || "",
        cellulare: initialData?.cellulare || "",
        aziendaId: initialData?.aziendaId || "",
        exLege: Boolean(initialData?.exLege) || false,
        titoloStudio: initialData?.titoloStudio || "",
        ccnl: initialData?.ccnl || "",
        contratto: initialData?.contratto || "",
        qualifica: initialData?.qualifica || "",
        annoAssunzione: initialData?.annoAssunzione || new Date().getFullYear().toString(),
      });
    }
  }, [initialData, isOpen, form]);

  const onSubmit = (data: ParticipantFormValues) => {
    if (!courseId) {
      toast.error("ID corso non valido");
      return;
    }
    
    const existingCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    const courseIndex = existingCourses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) {
      toast.error("Corso non trovato");
      return;
    }
    
    const selectedCompany = companies.find(company => company.id === data.aziendaId);
    const aziendaDetails = selectedCompany ? {
      aziendaId: selectedCompany.id,
      azienda: selectedCompany.ragioneSociale
    } : { azienda: "Non specificata" };
    
    const newParticipant = {
      id: isEditing && initialData.id ? initialData.id : uuidv4(),
      ...data,
      ...aziendaDetails
    };
    
    if (!existingCourses[courseIndex].partecipantiList) {
      existingCourses[courseIndex].partecipantiList = [];
    }
    
    if (isEditing && initialData.id) {
      const participantIndex = existingCourses[courseIndex].partecipantiList.findIndex(
        participant => participant.id === initialData.id
      );
      if (participantIndex !== -1) {
        existingCourses[courseIndex].partecipantiList[participantIndex] = {
          ...existingCourses[courseIndex].partecipantiList[participantIndex],
          ...newParticipant
        };
        
        updateParticipantGlobally(newParticipant);
      }
    } else {
      existingCourses[courseIndex].partecipantiList.push(newParticipant);
      
      existingCourses[courseIndex].partecipanti = 
        (existingCourses[courseIndex].partecipanti || 0) + 1;
        
      const existingParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
      existingParticipants.push(newParticipant);
      localStorage.setItem('participants', JSON.stringify(existingParticipants));
    }
    
    localStorage.setItem('courses', JSON.stringify(existingCourses));
    
    toast.success(isEditing 
      ? "Partecipante aggiornato con successo" 
      : "Partecipante aggiunto con successo"
    );
    
    onClose();
    
    window.location.reload();
  };

  const handleOpenCompanyForm = () => {
    setIsCompanyFormOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifica Partecipante' : 'Aggiungi Partecipante'}</DialogTitle>
            <DialogDescription>Inserisci i dati del partecipante al corso</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Mario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cognome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognome</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Rossi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codiceFiscale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input placeholder="es. RSSMRA80A01H501U" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luogoNascita"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luogo di nascita</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Roma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataNascita"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data di nascita</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: it })
                              ) : (
                                <span>Seleziona data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date > new Date()}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="es. mario.rossi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cellulare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero di cellulare</FormLabel>
                      <FormControl>
                        <Input placeholder="es. +39 333 1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aziendaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Azienda di appartenenza</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Seleziona un'azienda" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.length > 0 ? 
                                companies.map(company => (
                                  <SelectItem key={company.id} value={company.id}>
                                    {company.ragioneSociale}
                                  </SelectItem>
                                )) : 
                                <SelectItem value="none" disabled>
                                  Nessuna azienda disponibile
                                </SelectItem>
                              }
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={handleOpenCompanyForm}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exLege"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Assunzione ai sensi ex lege 68/99
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titoloStudio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titolo di studio</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona titolo di studio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="licenzaMedia">Licenza media</SelectItem>
                            <SelectItem value="diplomaSuperiore">Diploma superiore</SelectItem>
                            <SelectItem value="laurea">Laurea</SelectItem>
                            <SelectItem value="masterPost">Master post-laurea</SelectItem>
                            <SelectItem value="dottorato">Dottorato</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ccnl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCNL di riferimento</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Commercio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contratto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipologia contrattuale</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona tipologia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="determinato">Tempo determinato</SelectItem>
                            <SelectItem value="indeterminato">Tempo indeterminato</SelectItem>
                            <SelectItem value="apprendistato">Apprendistato</SelectItem>
                            <SelectItem value="stagionale">Stagionale</SelectItem>
                            <SelectItem value="collaborazione">Collaborazione</SelectItem>
                            <SelectItem value="partita-iva">Partita IVA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualifica"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualifica professionale</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Impiegato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annoAssunzione"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anno di assunzione</FormLabel>
                      <FormControl>
                        <Input placeholder="es. 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
                <Button type="submit">{isEditing ? 'Aggiorna' : 'Aggiungi'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <CompanyFormDialog 
        isOpen={isCompanyFormOpen}
        onClose={() => setIsCompanyFormOpen(false)}
      />
    </>
  );
};

export default ParticipantFormDialog;

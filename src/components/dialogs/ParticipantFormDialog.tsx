
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import CompanyFormDialog from './CompanyFormDialog';
import { useParticipantActions } from '@/hooks/useParticipantActions';
import { parseDateIfNeeded, parseInitialDate } from '@/utils/dateUtils';
import { PersonalInfoFields } from '../participant-form/PersonalInfoFields';
import { CredentialFields } from '../participant-form/CredentialFields';
import { EmploymentFields } from '../participant-form/EmploymentFields';
import { ParticipantFormValues, ParticipantFormDialogProps } from '@/types/participant';

const ParticipantFormDialog: React.FC<ParticipantFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false
}) => {
  const { id: courseId } = useParams();
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
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
      dataNascita: parseInitialDate(initialData?.dataNascita),
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
        dataNascita: parseInitialDate(initialData?.dataNascita),
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
                <PersonalInfoFields form={form} />
                <CredentialFields form={form} />
                
                <FormField
                  control={form.control}
                  name="aziendaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Azienda di appartenenza</FormLabel>
                      <div className="flex space-x-2">
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
                        <Button type="button" variant="outline" size="icon" onClick={handleOpenCompanyForm}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <EmploymentFields form={form} />
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

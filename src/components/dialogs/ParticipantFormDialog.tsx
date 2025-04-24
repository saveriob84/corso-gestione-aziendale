import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useAuth } from '@/hooks/useAuth';
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
import { supabase } from '@/integrations/supabase/client';

interface ExtendedParticipantFormDialogProps extends ParticipantFormDialogProps {
  courseId?: string;
}

const ParticipantFormDialog: React.FC<ExtendedParticipantFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  courseId
}) => {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [corso, setCorso] = useState<any>(null);
  const { user } = useAuth();

  const { updateParticipantGlobally } = useParticipantActions(
    courseId || '', 
    corso, 
    setCorso
  );

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const { data: courseData, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

          if (error) {
            console.error('Error fetching course from Supabase:', error);
            const courses = JSON.parse(localStorage.getItem('courses') || '[]');
            const currentCourse = courses.find((c: any) => c.id === courseId);
            if (currentCourse) {
              console.log('Course found in localStorage:', currentCourse);
              setCorso(currentCourse);
            } else {
              console.error('Course not found in localStorage either');
              toast.error("Corso non trovato");
            }
            return;
          }

          console.log('Course found in Supabase:', courseData);
          setCorso(courseData);
        } catch (err) {
          console.error('Error in fetchCourseData:', err);
          toast.error("Errore nel recupero dei dati del corso");
        }
      };

      fetchCourseData();
    } else {
      console.error('No courseId provided to ParticipantFormDialog');
    }
  }, [courseId, isOpen]);
  
  const formattedInitialData = {
    ...initialData,
    datanascita: parseDateIfNeeded(initialData?.datanascita),
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
      codicefiscale: formattedInitialData?.codicefiscale || "",
      luogonascita: formattedInitialData?.luogonascita || "",
      datanascita: parseInitialDate(initialData?.datanascita),
      username: formattedInitialData?.username || "",
      password: formattedInitialData?.password || "",
      numerocellulare: formattedInitialData?.numerocellulare || "",
      aziendaId: formattedInitialData?.aziendaId || "",
      exLege: formattedInitialData?.exLege || false,
      titolostudio: formattedInitialData?.titolostudio || "",
      ccnl: formattedInitialData?.ccnl || "",
      contratto: formattedInitialData?.contratto || "",
      qualifica: formattedInitialData?.qualifica || "",
      annoassunzione: formattedInitialData?.annoassunzione || new Date().getFullYear().toString(),
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        nome: initialData?.nome || "",
        cognome: initialData?.cognome || "",
        codicefiscale: initialData?.codicefiscale || "",
        luogonascita: initialData?.luogonascita || "",
        datanascita: parseInitialDate(initialData?.datanascita),
        username: initialData?.username || "",
        password: initialData?.password || "",
        numerocellulare: initialData?.numerocellulare || "",
        aziendaId: initialData?.aziendaId || "",
        exLege: Boolean(initialData?.exLege) || false,
        titolostudio: initialData?.titolostudio || "",
        ccnl: initialData?.ccnl || "",
        contratto: initialData?.contratto || "",
        qualifica: initialData?.qualifica || "",
        annoassunzione: initialData?.annoassunzione || new Date().getFullYear().toString(),
      });
    }
  }, [initialData, isOpen, form]);

  const onSubmit = (data: ParticipantFormValues) => {
    if (!courseId) {
      toast.error("ID corso non valido");
      return;
    }

    if (!user) {
      toast.error("Devi effettuare l'accesso per aggiungere un partecipante");
      return;
    }
    
    const existingCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    const courseIndex = existingCourses.findIndex((course: any) => course.id === courseId);
    
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
      ...aziendaDetails,
      user_id: user.id
    };
    
    if (!existingCourses[courseIndex].partecipantiList) {
      existingCourses[courseIndex].partecipantiList = [];
    }
    
    if (isEditing && initialData.id) {
      const participantIndex = existingCourses[courseIndex].partecipantiList.findIndex(
        (participant: any) => participant.id === initialData.id
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

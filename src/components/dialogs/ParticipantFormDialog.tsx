
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
            toast.error("Corso non trovato");
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
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase.from('companies').select('*');
        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error('Error loading companies:', error);
        toast.error("Errore nel caricamento delle aziende");
      }
    };
    
    fetchCompanies();
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

  const onSubmit = async (data: ParticipantFormValues) => {
    if (!user) {
      toast.error("Devi effettuare l'accesso per aggiungere un partecipante");
      return;
    }
    
    try {
      const selectedCompany = companies.find(company => company.id === data.aziendaId);
      const aziendaDetails = selectedCompany ? {
        aziendaId: selectedCompany.id,
        azienda: selectedCompany.ragioneSociale
      } : { azienda: "Non specificata" };
      
      let participantId: string;
      
      if (isEditing && initialData.id) {
        // Update existing participant
        const { error } = await supabase
          .from('participants')
          .update({
            nome: data.nome,
            cognome: data.cognome,
            codicefiscale: data.codicefiscale,
            luogonascita: data.luogonascita,
            datanascita: data.datanascita?.toISOString(),
            username: data.username,
            password: data.password,
            numerocellulare: data.numerocellulare,
            aziendaid: data.aziendaId,
            azienda: aziendaDetails.azienda,
            titolostudio: data.titolostudio,
            ccnl: data.ccnl,
            contratto: data.contratto,
            qualifica: data.qualifica,
            annoassunzione: data.annoassunzione,
          })
          .eq('id', initialData.id);
        
        if (error) throw error;
        participantId = initialData.id;
        
        updateParticipantGlobally({
          id: participantId,
          ...data,
          ...aziendaDetails
        });
        
      } else {
        // Create new participant
        const newParticipantId = uuidv4();
        
        const { error } = await supabase
          .from('participants')
          .insert({
            id: newParticipantId,
            nome: data.nome,
            cognome: data.cognome,
            codicefiscale: data.codicefiscale,
            luogonascita: data.luogonascita,
            datanascita: data.datanascita?.toISOString(),
            username: data.username,
            password: data.password,
            numerocellulare: data.numerocellulare,
            aziendaid: data.aziendaId,
            azienda: aziendaDetails.azienda,
            titolostudio: data.titolostudio,
            ccnl: data.ccnl,
            contratto: data.contratto,
            qualifica: data.qualifica,
            annoassunzione: data.annoassunzione,
            user_id: user.id
          });
        
        if (error) throw error;
        participantId = newParticipantId;
        
        // If we're adding a participant from the course detail page, add to junction table
        if (courseId) {
          const { error: junctionError } = await supabase
            .from('course_participants')
            .insert({
              course_id: courseId,
              participant_id: participantId,
              user_id: user.id
            });
          
          if (junctionError) throw junctionError;
        }
      }
      
      toast.success(isEditing 
        ? "Partecipante aggiornato con successo" 
        : "Partecipante aggiunto con successo"
      );
      
      // If we're in a course detail page, refresh the page to update the participant list
      if (courseId) {
        onClose();
        window.location.reload();
      } else {
        onClose();
      }
      
    } catch (error: any) {
      console.error('Error in participant submit:', error);
      toast.error(`Errore: ${error.message || 'Si è verificato un errore'}`);
    }
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

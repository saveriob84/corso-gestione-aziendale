
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { ParticipantFormValues, ParticipantFormDialogProps } from '@/types/participant';
import { formatDateForStorage } from '@/utils/dateUtils';
import { PersonalInfoFields } from '../participant-form/PersonalInfoFields';
import { CredentialFields } from '../participant-form/CredentialFields';
import { EmploymentFields } from '../participant-form/EmploymentFields';
import { CompanySelector } from '../participant-form/CompanySelector';
import { useParticipantForm } from '@/hooks/useParticipantForm';
import { updateParticipant, createParticipant } from '@/utils/participantUtils';

interface ExtendedParticipantFormDialogProps extends ParticipantFormDialogProps {
  courseId?: string;
}

const ParticipantFormDialog: React.FC<ExtendedParticipantFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  courseId,
  onSuccess
}) => {
  const { user } = useAuth();
  const { 
    form, 
    isCompanyFormOpen, 
    setIsCompanyFormOpen, 
    companies 
  } = useParticipantForm(initialData, isOpen);
  
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
      
      const formattedBirthDate = formatDateForStorage(data.datanascita);
      
      let participantId: string;
      
      if (isEditing && initialData.id) {
        const { error } = await updateParticipant(initialData.id, data, aziendaDetails, formattedBirthDate);
        
        if (error) throw error;
        participantId = initialData.id;
        
        toast.success("Partecipante aggiornato con successo");
        onSuccess?.();
        
      } else {
        const newParticipantId = uuidv4();
        
        const { error } = await createParticipant(
          newParticipantId, 
          data, 
          user.id, 
          aziendaDetails, 
          formattedBirthDate,
          courseId
        );
        
        if (error) throw error;
        participantId = newParticipantId;
      }
      
      toast.success(isEditing 
        ? "Partecipante aggiornato con successo" 
        : "Partecipante aggiunto con successo"
      );
      
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto pointer-events-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Partecipante' : 'Aggiungi Partecipante'}</DialogTitle>
          <DialogDescription>Inserisci i dati del partecipante al corso</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PersonalInfoFields form={form} />
              <CredentialFields form={form} />
              
              <CompanySelector 
                form={form} 
                companies={companies}
                onAddCompany={() => setIsCompanyFormOpen(true)}
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
  );
};

export default ParticipantFormDialog;

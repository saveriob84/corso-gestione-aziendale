
import { useState } from 'react';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { ParticipantFormValues } from '@/types/participant';
import { formatDateForStorage } from '@/utils/dateUtils';
import { updateParticipant, createParticipant } from '@/utils/participantUtils';

export const useParticipantSubmit = (
  initialData: Partial<ParticipantFormValues> = {},
  isEditing = false,
  courseId?: string,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (data: ParticipantFormValues, companies: any[]) => {
    console.log('useParticipantSubmit - starting submission with data:', data);
    console.log('useParticipantSubmit - companies:', companies);
    
    if (!user) {
      toast.error("Devi effettuare l'accesso per aggiungere un partecipante");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure we have a valid company selection
      const selectedCompany = data.aziendaId ? 
        companies.find(company => company.id === data.aziendaId) : 
        null;
      
      console.log('useParticipantSubmit - selectedCompany:', selectedCompany);
        
      const aziendaDetails = selectedCompany ? {
        aziendaId: selectedCompany.id,
        azienda: selectedCompany.ragioneSociale
      } : { azienda: "Non specificata" };
      
      const formattedBirthDate = formatDateForStorage(data.datanascita);
      console.log('useParticipantSubmit - formattedBirthDate:', formattedBirthDate);
      
      let participantId: string;
      
      if (isEditing && initialData.id) {
        console.log('useParticipantSubmit - updating participant:', initialData.id);
        const { error } = await updateParticipant(initialData.id, data, aziendaDetails, formattedBirthDate);
        
        if (error) {
          console.error('Error updating participant:', error);
          throw error;
        }
        
        participantId = initialData.id;
        console.log('useParticipantSubmit - participant updated:', participantId);
        toast.success("Partecipante aggiornato con successo");
        onSuccess?.();
        
      } else {
        const newParticipantId = uuidv4();
        console.log('useParticipantSubmit - creating new participant:', newParticipantId);
        
        const { error } = await createParticipant(
          newParticipantId, 
          data, 
          user.id, 
          aziendaDetails, 
          formattedBirthDate,
          courseId
        );
        
        if (error) {
          console.error('Error creating participant:', error);
          throw error;
        }
        
        participantId = newParticipantId;
        console.log('useParticipantSubmit - participant created:', participantId);
        toast.success("Partecipante aggiunto con successo");
      }
      
      if (courseId) {
        onClose?.();
        window.location.reload();
      } else {
        onClose?.();
      }
      
    } catch (error: any) {
      console.error('Error in participant submit:', error);
      toast.error(`Errore: ${error.message || 'Si è verificato un errore'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};

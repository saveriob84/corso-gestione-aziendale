
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
    if (!user) {
      toast.error("Devi effettuare l'accesso per aggiungere un partecipante");
      return;
    }
    
    setIsSubmitting(true);
    
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

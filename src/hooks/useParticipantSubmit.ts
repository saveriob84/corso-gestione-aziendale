
import { useState } from 'react';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { ParticipantFormValues } from '@/types/participant';
import { supabase } from '@/integrations/supabase/client';
import { createParticipant, updateParticipant } from '@/utils/participantUtils';

export const useParticipantSubmit = (
  initialData: Partial<ParticipantFormValues> = {},
  isEditing = false,
  courseId?: string,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (data: ParticipantFormValues) => {
    if (!user) {
      toast.error("Devi effettuare l'accesso per aggiungere un partecipante");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditing && initialData.id) {
        result = await updateParticipant(initialData.id, data);
        
        if (result.error) {
          throw result.error;
        }
        
        toast.success("Partecipante aggiornato con successo");
      } else {
        const newParticipantId = uuidv4();
        result = await createParticipant(newParticipantId, data, user.id, courseId);
        
        if (result.error) {
          throw result.error;
        }
        
        toast.success("Partecipante aggiunto con successo");
      }
      
      if (courseId) {
        onClose?.();
        window.location.reload();
      } else {
        onClose?.();
        onSuccess?.();
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

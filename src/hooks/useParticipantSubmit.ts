
import { useState } from 'react';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { ParticipantFormValues } from '@/types/participant';
import { supabase } from '@/integrations/supabase/client';

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
      let participantId: string;
      
      if (isEditing && initialData.id) {
        // Create an update object with only defined values
        const updateData = {
          nome: data.nome,
          cognome: data.cognome,
        };

        const { error } = await supabase
          .from('participants')
          .update(updateData)
          .eq('id', initialData.id);
        
        if (error) {
          throw error;
        }
        
        participantId = initialData.id;
        toast.success("Partecipante aggiornato con successo");
        onSuccess?.();
        
      } else {
        const newParticipantId = uuidv4();
        
        const insertData = {
          id: newParticipantId,
          nome: data.nome,
          cognome: data.cognome,
          user_id: user.id
        };

        const { error } = await supabase
          .from('participants')
          .insert(insertData);
          
        if (error) {
          throw error;
        }
        
        if (courseId) {
          const { error: courseParticipantError } = await supabase
            .from('course_participants')
            .insert({
              course_id: courseId,
              participant_id: newParticipantId,
              user_id: user.id
            });
            
          if (courseParticipantError) {
            throw courseParticipantError;
          }
        }
        
        participantId = newParticipantId;
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

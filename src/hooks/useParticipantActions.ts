import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useParticipantActions = (courseId: string, corso: any, setCorso: (corso: any) => void) => {
  const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);
  const [isDeleteParticipantDialogOpen, setIsDeleteParticipantDialogOpen] = useState(false);

  const handleDeleteParticipant = (participantId: string) => {
    setParticipantToDelete(participantId);
    setIsDeleteParticipantDialogOpen(true);
  };

  const confirmDeleteParticipant = async () => {
    if (!participantToDelete) return;
    
    try {
      // Delete from the junction table rather than updating the participant record
      const { error } = await supabase
        .from('course_participants')
        .delete()
        .eq('participant_id', participantToDelete)
        .eq('course_id', courseId);
      
      if (error) {
        console.error('Error removing participant from course:', error);
        toast.error("Errore nella rimozione del partecipante dal corso");
        return;
      }
      
      // Update local state
      if (corso && corso.partecipantiList) {
        const updatedParticipantsList = corso.partecipantiList.filter(
          (p: any) => p.id !== participantToDelete
        );
        
        setCorso({
          ...corso,
          partecipantiList: updatedParticipantsList,
          partecipanti: updatedParticipantsList.length
        });
      }
      
      toast.success("Partecipante rimosso dal corso con successo");
      setIsDeleteParticipantDialogOpen(false);
    } catch (error) {
      console.error('Error in confirmDeleteParticipant:', error);
      toast.error("Errore nella rimozione del partecipante dal corso");
    }
  };

  const handleAddExistingParticipant = async (participant: any) => {
    if (!courseId) {
      toast.error("ID corso non valido");
      return;
    }

    try {
      // Check if participant is already in the course via the junction table
      const { data: existingRelation, error: checkError } = await supabase
        .from('course_participants')
        .select('*')
        .eq('course_id', courseId)
        .eq('participant_id', participant.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking course participant relation:', checkError);
        toast.error("Errore nel controllo della relazione corso-partecipante");
        return;
      }

      if (existingRelation) {
        toast.error("Il partecipante è già presente in questo corso");
        return;
      }

      // Add the participant to the course via the junction table
      const { error } = await supabase
        .from('course_participants')
        .insert({
          course_id: courseId,
          participant_id: participant.id,
          user_id: participant.user_id
        });

      if (error) {
        console.error('Error adding participant to course:', error);
        toast.error("Errore nell'aggiunta del partecipante al corso");
        return;
      }

      // Update local state
      const updatedParticipantsList = [
        ...(corso?.partecipantiList || []),
        participant
      ];

      setCorso({
        ...corso,
        partecipantiList: updatedParticipantsList,
        partecipanti: updatedParticipantsList.length
      });

      toast.success("Partecipante aggiunto al corso con successo");
    } catch (error) {
      console.error('Error in handleAddExistingParticipant:', error);
      toast.error("Errore nell'aggiunta del partecipante al corso");
    }
  };

  return {
    participantToDelete,
    isDeleteParticipantDialogOpen,
    setIsDeleteParticipantDialogOpen,
    handleDeleteParticipant,
    confirmDeleteParticipant,
    handleAddExistingParticipant
  };
};

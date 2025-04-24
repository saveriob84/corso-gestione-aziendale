
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
      // Try to delete from Supabase first
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantToDelete)
        .eq('course_id', courseId);
      
      if (error) {
        console.error('Error deleting participant from Supabase:', error);
        // Fall back to local storage if Supabase fails
        const existingCourses = localStorage.getItem('courses') 
          ? JSON.parse(localStorage.getItem('courses')!) 
          : [];
        
        const courseIndex = existingCourses.findIndex((course: any) => course.id === courseId);
        
        if (courseIndex === -1) {
          toast.error("Corso non trovato");
          return;
        }
        
        const updatedParticipantsList = existingCourses[courseIndex].partecipantiList.filter(
          (participant: any) => participant.id !== participantToDelete
        );
        
        existingCourses[courseIndex].partecipantiList = updatedParticipantsList;
        existingCourses[courseIndex].partecipanti = updatedParticipantsList.length;
        
        localStorage.setItem('courses', JSON.stringify(existingCourses));
      }
      
      // Update local state regardless of whether Supabase or localStorage was used
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
      
      toast.success("Partecipante eliminato con successo");
      setIsDeleteParticipantDialogOpen(false);
    } catch (error) {
      console.error('Error in confirmDeleteParticipant:', error);
      toast.error("Errore nell'eliminazione del partecipante");
    }
  };

  const handleAddExistingParticipant = async (participant: any) => {
    if (!courseId) {
      toast.error("ID corso non valido");
      return;
    }

    try {
      // Check if participant is already in the course
      if (corso?.partecipantiList?.some((p: any) => p.id === participant.id)) {
        toast.error("Il partecipante è già presente in questo corso");
        return;
      }

      // Add the participant to the course in Supabase
      const { error } = await supabase
        .from('participants')
        .update({ course_id: courseId })
        .eq('id', participant.id);

      if (error) {
        console.error('Error adding participant to course in Supabase:', error);
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

  // Function to update the global participant list when a participant is updated in a course
  const updateParticipantGlobally = (updatedParticipant: any) => {
    // Update the participant in the global participants list
    const existingParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
    
    const participantIndex = existingParticipants.findIndex((p: any) => p.id === updatedParticipant.id);
    
    if (participantIndex !== -1) {
      // Update existing participant
      existingParticipants[participantIndex] = {
        ...existingParticipants[participantIndex],
        ...updatedParticipant
      };
      
      localStorage.setItem('participants', JSON.stringify(existingParticipants));
    }
  };

  return {
    participantToDelete,
    isDeleteParticipantDialogOpen,
    setIsDeleteParticipantDialogOpen,
    handleDeleteParticipant,
    confirmDeleteParticipant,
    handleAddExistingParticipant,
    updateParticipantGlobally
  };
};

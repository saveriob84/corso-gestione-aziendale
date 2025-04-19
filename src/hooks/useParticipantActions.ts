
import { useState } from 'react';
import { toast } from 'sonner';

export const useParticipantActions = (courseId: string, corso: any, setCorso: (corso: any) => void) => {
  const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);
  const [isDeleteParticipantDialogOpen, setIsDeleteParticipantDialogOpen] = useState(false);

  const handleDeleteParticipant = (participantId: string) => {
    setParticipantToDelete(participantId);
    setIsDeleteParticipantDialogOpen(true);
  };

  const confirmDeleteParticipant = () => {
    if (!participantToDelete) return;
    
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
    
    setCorso({
      ...corso,
      partecipantiList: updatedParticipantsList,
      partecipanti: updatedParticipantsList.length
    });
    
    toast.success("Partecipante eliminato con successo");
    setIsDeleteParticipantDialogOpen(false);
  };

  const handleAddExistingParticipant = (participant: any) => {
    const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const courseIndex = existingCourses.findIndex((c: any) => c.id === courseId);
    
    if (courseIndex === -1) {
      toast.error("Corso non trovato");
      return;
    }

    const isParticipantInCourse = existingCourses[courseIndex].partecipantiList?.some(
      (p: any) => p.id === participant.id
    );

    if (isParticipantInCourse) {
      toast.error("Il partecipante è già presente in questo corso");
      return;
    }

    const updatedParticipantsList = [
      ...(existingCourses[courseIndex].partecipantiList || []),
      participant
    ];

    existingCourses[courseIndex].partecipantiList = updatedParticipantsList;
    existingCourses[courseIndex].partecipanti = updatedParticipantsList.length;

    localStorage.setItem('courses', JSON.stringify(existingCourses));
    
    setCorso({
      ...corso,
      partecipantiList: updatedParticipantsList,
      partecipanti: updatedParticipantsList.length
    });

    toast.success("Partecipante aggiunto al corso con successo");
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

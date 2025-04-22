
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import CourseFormDialog from '../dialogs/CourseFormDialog';
import LessonFormDialog from '../dialogs/LessonFormDialog';
import ParticipantFormDialog from '../dialogs/ParticipantFormDialog';
import TeacherTutorFormDialog from '../dialogs/TeacherTutorFormDialog';
import ParticipantSearchDialog from '../dialogs/ParticipantSearchDialog';
import PdfViewer from '../pdf/PdfViewer';

interface CourseDetailDialogsProps {
  corso: any;
  isEditingCourse: boolean;
  isAddingLesson: boolean;
  isEditingLesson: boolean;
  isAddingParticipant: boolean;
  isEditingParticipant: boolean;
  isAddingTeacher: boolean;
  isAddingTutor: boolean;
  isParticipantSearchOpen: boolean;
  selectedPdfType: 'inizioCorso' | 'fineCorso' | 'elencoPartecipanti' | 'elencoDocenti' | null;
  selectedLesson: any;
  selectedParticipant: any;
  isDeleteParticipantDialogOpen: boolean;
  onCloseEditCourse: () => void;
  onCloseAddLesson: () => void;
  onCloseEditLesson: () => void;
  onCloseAddParticipant: () => void;
  onCloseEditParticipant: () => void;
  onCloseAddTeacher: () => void;
  onCloseAddTutor: () => void;
  onCloseParticipantSearch: () => void;
  onClosePdfViewer: () => void;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
  handleAddExistingParticipant: (participant: any) => void;
  onSubmitLesson?: (values: any) => Promise<void>;
  onDeleteLesson?: (lessonId: string) => Promise<void>;
}

const CourseDetailDialogs = ({
  corso,
  isEditingCourse,
  isAddingLesson,
  isEditingLesson,
  isAddingParticipant,
  isEditingParticipant,
  isAddingTeacher,
  isAddingTutor,
  isParticipantSearchOpen,
  selectedPdfType,
  selectedLesson,
  selectedParticipant,
  isDeleteParticipantDialogOpen,
  onCloseEditCourse,
  onCloseAddLesson,
  onCloseEditLesson,
  onCloseAddParticipant,
  onCloseEditParticipant,
  onCloseAddTeacher,
  onCloseAddTutor,
  onCloseParticipantSearch,
  onClosePdfViewer,
  onCloseDeleteDialog,
  onConfirmDelete,
  handleAddExistingParticipant,
  onSubmitLesson,
  onDeleteLesson
}: CourseDetailDialogsProps) => {
  return (
    <>
      <CourseFormDialog
        isOpen={isEditingCourse}
        onClose={onCloseEditCourse}
        initialData={corso}
        isEditing={true}
      />
      
      <LessonFormDialog
        isOpen={isAddingLesson}
        onClose={onCloseAddLesson}
        onSubmit={onSubmitLesson}
      />
      
      <LessonFormDialog
        isOpen={isEditingLesson}
        onClose={onCloseEditLesson}
        initialData={selectedLesson}
        isEditing={true}
        onSubmit={onSubmitLesson}
        onDelete={onDeleteLesson && selectedLesson ? () => onDeleteLesson(selectedLesson.id) : undefined}
      />
      
      <ParticipantFormDialog
        isOpen={isAddingParticipant}
        onClose={onCloseAddParticipant}
      />
      
      <ParticipantFormDialog
        isOpen={isEditingParticipant}
        onClose={onCloseEditParticipant}
        initialData={selectedParticipant}
        isEditing={true}
      />
      
      <TeacherTutorFormDialog
        isOpen={isAddingTeacher}
        onClose={onCloseAddTeacher}
        type="docente"
      />
      
      <TeacherTutorFormDialog
        isOpen={isAddingTutor}
        onClose={onCloseAddTutor}
        type="tutor"
      />
      
      {selectedPdfType && (
        <PdfViewer
          pdfType={selectedPdfType}
          corso={corso}
          isOpen={Boolean(selectedPdfType)}
          onClose={onClosePdfViewer}
        />
      )}
      
      <AlertDialog 
        open={isDeleteParticipantDialogOpen} 
        onOpenChange={onCloseDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo partecipante? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ParticipantSearchDialog
        isOpen={isParticipantSearchOpen}
        onClose={onCloseParticipantSearch}
        onSelectParticipant={handleAddExistingParticipant}
      />
    </>
  );
};

export default CourseDetailDialogs;

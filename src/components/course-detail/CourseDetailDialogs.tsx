
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
  isDeleteLessonDialogOpen?: boolean;
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
  onCloseDeleteLessonDialog?: () => void;
  onConfirmDelete: () => void;
  onConfirmDeleteLesson?: () => void;
  handleAddExistingParticipant: (participant: any) => void;
  onSubmitLesson?: (values: any) => Promise<void>;
  onDeleteLesson?: () => Promise<void>;
  courseId?: string;
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
  isDeleteLessonDialogOpen = false,
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
  onCloseDeleteLessonDialog = () => {},
  onConfirmDelete,
  onConfirmDeleteLesson = () => {},
  handleAddExistingParticipant,
  onSubmitLesson,
  onDeleteLesson,
  courseId
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
      />
      
      <ParticipantFormDialog
        isOpen={isAddingParticipant}
        onClose={onCloseAddParticipant}
        courseId={courseId}
      />
      
      <ParticipantFormDialog
        isOpen={isEditingParticipant}
        onClose={onCloseEditParticipant}
        initialData={selectedParticipant}
        isEditing={true}
        courseId={courseId}
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

      <AlertDialog 
        open={isDeleteLessonDialogOpen} 
        onOpenChange={onCloseDeleteLessonDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questa giornata di lezione? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDeleteLesson}
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
        courseId={courseId}
      />
    </>
  );
};

export default CourseDetailDialogs;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseHeader from '@/components/course-detail/CourseHeader';
import CourseInfo from '@/components/course-detail/CourseInfo';
import LessonList from '@/components/course-detail/LessonList';
import ParticipantList from '@/components/course-detail/ParticipantList';
import TeacherTutorList from '@/components/course-detail/TeacherTutorList';
import LessonFormDialog from '@/components/dialogs/LessonFormDialog';
import ParticipantFormDialog from '@/components/dialogs/ParticipantFormDialog';
import TeacherTutorFormDialog from '@/components/dialogs/TeacherTutorFormDialog';
import CourseFormDialog from '@/components/dialogs/CourseFormDialog';
import PdfViewer from '@/components/pdf/PdfViewer';
import ParticipantSearchDialog from '@/components/dialogs/ParticipantSearchDialog';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useParticipantActions } from '@/hooks/useParticipantActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { getParticipantTemplate } from '@/utils/excelTemplates';

const DettaglioCorso = () => {
  const { id } = useParams<{ id: string }>();
  
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isAddingTutor, setIsAddingTutor] = useState(false);
  const [selectedPdfType, setSelectedPdfType] = useState<null | 'inizioCorso' | 'fineCorso' | 'elencoPartecipanti' | 'elencoDocenti'>(null);
  
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [isParticipantSearchOpen, setIsParticipantSearchOpen] = useState(false);

  const { corso, setCorso, companies } = useCourseDetail(id!);
  
  const {
    isDeleteParticipantDialogOpen,
    setIsDeleteParticipantDialogOpen,
    handleDeleteParticipant,
    confirmDeleteParticipant,
    handleAddExistingParticipant
  } = useParticipantActions(id!, corso, setCorso);

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsEditingLesson(true);
  };

  const handleEditParticipant = (participantId: string) => {
    const participantToEdit = corso?.partecipantiList?.find(
      (p: any) => p.id === participantId
    );
    
    if (participantToEdit) {
      setSelectedParticipant(participantToEdit);
      setIsEditingParticipant(true);
    } else {
      toast.error("Partecipante non trovato");
    }
  };

  const handleGeneratePdf = () => {
    setSelectedPdfType('inizioCorso');
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(company => company.id === companyId);
    return company ? company.ragioneSociale : "Non specificata";
  };

  const downloadTemplate = () => {
    try {
      const template = getParticipantTemplate();
      const worksheet = XLSX.utils.json_to_sheet(template);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      XLSX.writeFile(workbook, 'template-partecipanti.xlsx');
      
      toast.success('Template scaricato con successo');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Errore durante il download del template');
    }
  };

  if (!corso) {
    return <div className="p-8 text-center">Caricamento corso in corso...</div>;
  }

  return (
    <div className="space-y-6">
      <CourseHeader 
        corso={corso}
        onEditCourse={() => setIsEditingCourse(true)}
        onGeneratePdf={handleGeneratePdf}
      />

      <Tabs defaultValue="anagrafica" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="anagrafica">Anagrafica</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="partecipanti">Partecipanti</TabsTrigger>
          <TabsTrigger value="docenti">Docenti e Tutor</TabsTrigger>
        </TabsList>

        <TabsContent value="anagrafica" className="space-y-4 mt-4">
          <CourseInfo corso={corso} />
        </TabsContent>

        <TabsContent value="calendario" className="mt-4">
          <LessonList 
            giornateDiLezione={corso.giornateDiLezione} 
            onAddLesson={() => {
              setSelectedLesson(null);
              setIsAddingLesson(true);
            }}
            onEditLesson={handleEditLesson}
          />
        </TabsContent>

        <TabsContent value="partecipanti" className="mt-4">
          <ParticipantList 
            partecipantiList={corso.partecipantiList}
            onEditParticipant={handleEditParticipant}
            onDeleteParticipant={handleDeleteParticipant}
            onDownloadTemplate={downloadTemplate}
            onImportExcel={() => document.getElementById('import-file')?.click()}
            onLoadExistingParticipant={() => setIsParticipantSearchOpen(true)}
            getCompanyName={getCompanyName}
          />
        </TabsContent>

        <TabsContent value="docenti" className="mt-4 space-y-6">
          <TeacherTutorList
            title="Docenti"
            description="Professori e specialisti"
            list={corso.docentiList}
            onAdd={() => setIsAddingTeacher(true)}
            type="docenti"
          />

          <TeacherTutorList
            title="Tutor"
            description="Assistenti e supporto"
            list={corso.tutorList}
            onAdd={() => setIsAddingTutor(true)}
            type="tutor"
          />
        </TabsContent>
      </Tabs>

      <CourseFormDialog
        isOpen={isEditingCourse}
        onClose={() => setIsEditingCourse(false)}
        initialData={corso}
        isEditing={true}
      />
      
      <LessonFormDialog
        isOpen={isAddingLesson}
        onClose={() => setIsAddingLesson(false)}
      />
      
      <LessonFormDialog
        isOpen={isEditingLesson}
        onClose={() => setIsEditingLesson(false)}
        initialData={selectedLesson}
        isEditing={true}
      />
      
      <ParticipantFormDialog
        isOpen={isAddingParticipant}
        onClose={() => setIsAddingParticipant(false)}
      />
      
      <ParticipantFormDialog
        isOpen={isEditingParticipant}
        onClose={() => setIsEditingParticipant(false)}
        initialData={selectedParticipant}
        isEditing={true}
      />
      
      <TeacherTutorFormDialog
        isOpen={isAddingTeacher}
        onClose={() => setIsAddingTeacher(false)}
        type="docente"
      />
      
      <TeacherTutorFormDialog
        isOpen={isAddingTutor}
        onClose={() => setIsAddingTutor(false)}
        type="tutor"
      />
      
      {selectedPdfType && (
        <PdfViewer
          pdfType={selectedPdfType}
          corso={corso}
          isOpen={Boolean(selectedPdfType)}
          onClose={() => setSelectedPdfType(null)}
        />
      )}
      
      <AlertDialog 
        open={isDeleteParticipantDialogOpen} 
        onOpenChange={setIsDeleteParticipantDialogOpen}
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
              onClick={confirmDeleteParticipant}
              className="bg-red-600 hover:bg-red-700"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ParticipantSearchDialog
        isOpen={isParticipantSearchOpen}
        onClose={() => setIsParticipantSearchOpen(false)}
        onSelectParticipant={handleAddExistingParticipant}
      />
    </div>
  );
};

export default DettaglioCorso;

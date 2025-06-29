
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useDetailedCourse } from '@/hooks/useDetailedCourse';
import { useParticipantActions } from '@/hooks/useParticipantActions';
import { getParticipantTemplate } from '@/utils/excelTemplates';
import CourseHeader from '@/components/course-detail/CourseHeader';
import CourseDetailTabs from '@/components/course-detail/CourseDetailTabs';
import CourseDetailDialogs from '@/components/course-detail/CourseDetailDialogs';

const DettaglioCorso = () => {
  const { corso, setCorso, addLesson, updateLesson, deleteLesson } = useDetailedCourse();
  
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
  const [companies, setCompanies] = useState<any[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    isDeleteParticipantDialogOpen,
    setIsDeleteParticipantDialogOpen,
    handleDeleteParticipant,
    confirmDeleteParticipant,
    handleAddExistingParticipant
  } = useParticipantActions(corso?.id || '', corso, setCorso);

  useEffect(() => {
    const loadCompanies = async () => {
      const { data } = await supabase.from('companies').select('*');
      if (data) setCompanies(data);
    };
    loadCompanies();
  }, []);

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsEditingLesson(true);
  };

  const handleAddLesson = () => {
    setSelectedLesson(null);
    setIsAddingLesson(true);
  };

  const handleLessonDialogClose = () => {
    setIsAddingLesson(false);
    setIsEditingLesson(false);
    setSelectedLesson(null);
  };

  const handleSubmitLesson = async (values: any) => {
    if (isEditingLesson && selectedLesson) {
      const success = await updateLesson(selectedLesson.id, values);
      if (success) handleLessonDialogClose();
    } else {
      const success = await addLesson(values);
      if (success) handleLessonDialogClose();
    }
  };

  const handleDeleteConfirmation = (lessonId: string) => {
    // Find the lesson to delete
    const lessonToDelete = corso?.giornateDiLezione?.find(
      (lesson: any) => lesson.id === lessonId
    );
    
    if (lessonToDelete) {
      setSelectedLesson(lessonToDelete);
      setIsDeleteConfirmOpen(true);
    } else {
      toast.error("Lezione non trovata");
    }
  };

  const handleDeleteLesson = async () => {
    if (selectedLesson && selectedLesson.id) {
      console.log("Attempting to delete lesson:", selectedLesson.id);
      setIsDeleteConfirmOpen(false);
      const success = await deleteLesson(selectedLesson.id);
      if (success) {
        setSelectedLesson(null);
        toast.success("Lezione eliminata con successo");
      }
    } else {
      toast.error("Impossibile eliminare: ID lezione non valido");
    }
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

  const handleAddParticipant = () => {
    setSelectedParticipant(null);
    setIsAddingParticipant(true);
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

      <CourseDetailTabs
        corso={corso}
        onAddLesson={handleAddLesson}
        onEditLesson={handleEditLesson}
        onDeleteLesson={handleDeleteConfirmation}
        onEditParticipant={handleEditParticipant}
        onDeleteParticipant={handleDeleteParticipant}
        onDownloadTemplate={downloadTemplate}
        onImportExcel={() => document.getElementById('import-file')?.click()}
        onLoadExistingParticipant={() => setIsParticipantSearchOpen(true)}
        onAddParticipant={handleAddParticipant}
        onAddTeacher={() => setIsAddingTeacher(true)}
        onAddTutor={() => setIsAddingTutor(true)}
        getCompanyName={getCompanyName}
        courseId={corso.id}
      />

      <CourseDetailDialogs
        corso={corso}
        isEditingCourse={isEditingCourse}
        isAddingLesson={isAddingLesson}
        isEditingLesson={isEditingLesson}
        isAddingParticipant={isAddingParticipant}
        isEditingParticipant={isEditingParticipant}
        isAddingTeacher={isAddingTeacher}
        isAddingTutor={isAddingTutor}
        isParticipantSearchOpen={isParticipantSearchOpen}
        selectedPdfType={selectedPdfType}
        selectedLesson={selectedLesson}
        selectedParticipant={selectedParticipant}
        isDeleteParticipantDialogOpen={isDeleteParticipantDialogOpen}
        isDeleteLessonDialogOpen={isDeleteConfirmOpen}
        onCloseEditCourse={() => setIsEditingCourse(false)}
        onCloseAddLesson={handleLessonDialogClose}
        onCloseEditLesson={handleLessonDialogClose}
        onCloseAddParticipant={() => setIsAddingParticipant(false)}
        onCloseEditParticipant={() => setIsEditingParticipant(false)}
        onCloseAddTeacher={() => setIsAddingTeacher(false)}
        onCloseAddTutor={() => setIsAddingTutor(false)}
        onCloseParticipantSearch={() => setIsParticipantSearchOpen(false)}
        onClosePdfViewer={() => setSelectedPdfType(null)}
        onCloseDeleteDialog={() => setIsDeleteParticipantDialogOpen(false)}
        onCloseDeleteLessonDialog={() => setIsDeleteConfirmOpen(false)}
        onConfirmDelete={confirmDeleteParticipant}
        onConfirmDeleteLesson={handleDeleteLesson}
        handleAddExistingParticipant={handleAddExistingParticipant}
        onSubmitLesson={handleSubmitLesson}
        onDeleteLesson={handleDeleteLesson}
        courseId={corso.id}
      />
    </div>
  );
};

export default DettaglioCorso;

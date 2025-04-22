
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

  const handleDeleteLesson = async (lessonId: string) => {
    const success = await deleteLesson(lessonId);
    if (success) handleLessonDialogClose();
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

      <CourseDetailTabs
        corso={corso}
        onAddLesson={handleAddLesson}
        onEditLesson={handleEditLesson}
        onEditParticipant={handleEditParticipant}
        onDeleteParticipant={handleDeleteParticipant}
        onDownloadTemplate={downloadTemplate}
        onImportExcel={() => document.getElementById('import-file')?.click()}
        onLoadExistingParticipant={() => setIsParticipantSearchOpen(true)}
        onAddTeacher={() => setIsAddingTeacher(true)}
        onAddTutor={() => setIsAddingTutor(true)}
        getCompanyName={getCompanyName}
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
        onConfirmDelete={confirmDeleteParticipant}
        handleAddExistingParticipant={handleAddExistingParticipant}
        onSubmitLesson={handleSubmitLesson}
        onDeleteLesson={handleDeleteLesson}
      />
    </div>
  );
};

export default DettaglioCorso;

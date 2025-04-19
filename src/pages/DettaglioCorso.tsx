
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
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

const DettaglioCorso = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
  const [isDeleteParticipantDialogOpen, setIsDeleteParticipantDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);
  
  const [corso, setCorso] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  
  useEffect(() => {
    const loadCourseData = () => {
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        const foundCourse = parsedCourses.find(course => course.id === id);
        if (foundCourse) {
          return foundCourse;
        }
      }
      
      const defaultCourses = [
        {
          id: "1",
          codice: "FORM-001",
          titolo: "Sicurezza sul Lavoro",
          dataInizio: "2023-10-15",
          dataFine: "2023-11-15",
          sede: "Via Roma 123, Milano",
          moduloFormativo: "Sicurezza generale",
          giornateDiLezione: [
            { id: "g1", data: "2023-10-15", orario: "09:00 - 13:00", sede: "Aula Magna" },
            { id: "g2", data: "2023-10-22", orario: "09:00 - 13:00", sede: "Aula Magna" },
            { id: "g3", data: "2023-11-05", orario: "09:00 - 13:00", sede: "Laboratorio A" },
            { id: "g4", data: "2023-11-15", orario: "09:00 - 13:00", sede: "Aula Magna" }
          ],
          partecipantiList: [
            { id: "p1", nome: "Mario", cognome: "Rossi", azienda: "TechSolutions Srl", ruolo: "Tecnico" },
            { id: "p2", nome: "Giulia", cognome: "Verdi", azienda: "TechSolutions Srl", ruolo: "Manager" },
            { id: "p3", nome: "Paolo", cognome: "Bianchi", azienda: "InnovaSpa", ruolo: "Operaio" },
            { id: "p4", nome: "Laura", cognome: "Neri", azienda: "InnovaSpa", ruolo: "Responsabile" }
          ],
          partecipanti: 4,
          docentiList: [
            { id: "d1", nome: "Prof. Alberto", cognome: "Mariani", specializzazione: "Sicurezza sul lavoro" }
          ],
          docenti: 1,
          tutorList: [
            { id: "t1", nome: "Dott.ssa Carla", cognome: "Esposito", ruolo: "Tutor d'aula" }
          ],
          tutor: 1,
          edizioni: 3,
          aziende: 5,
          stato: "Completato"
        },
        {
          id: "2",
          codice: "FORM-002",
          titolo: "Marketing Digitale",
          dataInizio: "2023-12-01",
          dataFine: "2023-12-20",
          sede: "Via Milano 45, Roma",
          moduloFormativo: "Marketing base",
          giornateDiLezione: [],
          partecipantiList: [],
          partecipanti: 0,
          docentiList: [],
          docenti: 0,
          tutorList: [],
          tutor: 0,
          edizioni: 1,
          aziende: 3,
          stato: "In corso"
        }
      ];
      
      return defaultCourses.find(course => course.id === id);
    };
    
    const foundCourse = loadCourseData();
    if (foundCourse) {
      setCorso(foundCourse);
    } else {
      toast.error("Corso non trovato");
      navigate("/corsi");
    }
    
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, [id, navigate]);

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditingLesson(true);
  };

  const handleEditParticipant = (participant) => {
    setSelectedParticipant(participant);
    setIsEditingParticipant(true);
  };
  
  const handleDeleteParticipant = (participantId) => {
    setParticipantToDelete(participantId);
    setIsDeleteParticipantDialogOpen(true);
  };
  
  const confirmDeleteParticipant = () => {
    if (!participantToDelete) return;
    
    const existingCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    const courseIndex = existingCourses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) {
      toast.error("Corso non trovato");
      return;
    }
    
    const updatedParticipantsList = existingCourses[courseIndex].partecipantiList.filter(
      participant => participant.id !== participantToDelete
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

  const handleGeneratePdf = () => {
    setSelectedPdfType('inizioCorso');
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(company => company.id === companyId);
    return company ? company.ragioneSociale : "Non specificata";
  };

  const downloadTemplate = () => {
    try {
      const template = [
        {
          'Nome*': '',
          'Cognome*': '',
          'Codice Fiscale*': '',
          'Data di Nascita (GG/MM/AAAA)': '',
          'Username': '',
          'Password': '',
          'Numero di cellulare': '',
          'Azienda': '',
          'Assunzione ex lege 68/99': '',
          'Titolo di Studio': '',
          'CCNL': '',
          'Tipologia contrattuale': '',
          'Qualifica professionale': '',
          'Anno di assunzione': ''
        }
      ];

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

  const handleLoadExistingParticipant = () => {
    const allCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!)
      : [];
    
    const allParticipants = allCourses.reduce((acc, course) => {
      if (course.id !== id && course.partecipantiList) {
        return [...acc, ...course.partecipantiList];
      }
      return acc;
    }, []);

    setSelectedParticipant(null);
    setIsAddingParticipant(true);
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
            onLoadExistingParticipant={handleLoadExistingParticipant}
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
    </div>
  );
};

export default DettaglioCorso;

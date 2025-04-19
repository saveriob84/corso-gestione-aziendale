
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, File, FileText, Users, BookOpen, PlusCircle, Download, Upload, Trash2, PenIcon, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LessonFormDialog from '@/components/dialogs/LessonFormDialog';
import ParticipantFormDialog from '@/components/dialogs/ParticipantFormDialog';
import TeacherTutorFormDialog from '@/components/dialogs/TeacherTutorFormDialog';
import CourseFormDialog from '@/components/dialogs/CourseFormDialog';
import PdfViewer from '@/components/pdf/PdfViewer';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
  
  // States for dialogs
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isAddingTutor, setIsAddingTutor] = useState(false);
  const [selectedPdfType, setSelectedPdfType] = useState<null | 'inizioCorso' | 'fineCorso' | 'elencoPartecipanti' | 'elencoDocenti'>(null);
  
  // State to handle lesson editing
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  // State to handle participant editing and deletion
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [isDeleteParticipantDialogOpen, setIsDeleteParticipantDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);
  
  // State to store the course data
  const [corso, setCorso] = useState<any>(null);
  // State to store companies for linking
  const [companies, setCompanies] = useState<any[]>([]);
  
  // Load course data and companies from localStorage
  useEffect(() => {
    const loadCourseData = () => {
      // First check for user-created courses in localStorage
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        const foundCourse = parsedCourses.find(course => course.id === id);
        if (foundCourse) {
          return foundCourse;
        }
      }
      
      // If not found in localStorage, check default courses
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
    
    // Load companies
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
    
    // Get existing courses
    const existingCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    // Find the course to update
    const courseIndex = existingCourses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) {
      toast.error("Corso non trovato");
      return;
    }
    
    // Remove participant from the list
    const updatedParticipantsList = existingCourses[courseIndex].partecipantiList.filter(
      participant => participant.id !== participantToDelete
    );
    
    // Update course with new participants list
    existingCourses[courseIndex].partecipantiList = updatedParticipantsList;
    
    // Update participant count
    existingCourses[courseIndex].partecipanti = updatedParticipantsList.length;
    
    // Save updated courses
    localStorage.setItem('courses', JSON.stringify(existingCourses));
    
    // Update the local state
    setCorso({
      ...corso,
      partecipantiList: updatedParticipantsList,
      partecipanti: updatedParticipantsList.length
    });
    
    // Show success message
    toast.success("Partecipante eliminato con successo");
    setIsDeleteParticipantDialogOpen(false);
  };

  const handleGeneratePdf = () => {
    setSelectedPdfType('inizioCorso');
  };

  // Function to get company name by id
  const getCompanyName = (companyId) => {
    const company = companies.find(company => company.id === companyId);
    return company ? company.ragioneSociale : "Non specificata";
  };

  // Function to format the date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString || 'Data non disponibile';
    }
  };

  if (!corso) {
    return <div className="p-8 text-center">Caricamento corso in corso...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
            {corso.titolo}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Codice: {corso.codice}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGeneratePdf}>
            <FileText className="mr-2 h-4 w-4" />
            Genera PDF
          </Button>
          <Button onClick={() => setIsEditingCourse(true)}>
            Modifica Corso
          </Button>
        </div>
      </div>

      <Tabs defaultValue="anagrafica" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="anagrafica">Anagrafica</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="partecipanti">Partecipanti</TabsTrigger>
          <TabsTrigger value="docenti">Docenti e Tutor</TabsTrigger>
        </TabsList>

        {/* Sezione Anagrafica */}
        <TabsContent value="anagrafica" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Corso</CardTitle>
              <CardDescription>Dati anagrafici del corso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Codice corso</p>
                  <p>{corso.codice}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Titolo</p>
                  <p>{corso.titolo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data inizio</p>
                  <p>{formatDate(corso.dataInizio)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data fine</p>
                  <p>{formatDate(corso.dataFine)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sede</p>
                  <p>{corso.sede}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Modulo formativo</p>
                  <p>{corso.moduloFormativo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documenti</CardTitle>
              <CardDescription>File allegati al corso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center">
                  <File className="h-10 w-10 text-slate-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium">Nessun documento caricato</p>
                    <p className="text-sm text-slate-500">Carica i documenti relativi al corso</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Carica
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendario tab content */}
        <TabsContent value="calendario" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Calendario Didattico</CardTitle>
                <CardDescription>Giornate di lezione programmate</CardDescription>
              </div>
              <Button size="sm" onClick={() => {
                setSelectedLesson(null);
                setIsAddingLesson(true);
                setIsEditingLesson(false);
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi Giornata
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Orario</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sede</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.giornateDiLezione && corso.giornateDiLezione.map((giornata, index) => (
                      <tr key={giornata.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{formatDate(giornata.data)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{giornata.orario}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{giornata.sede}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditLesson(giornata)}
                              className="flex items-center"
                            >
                              <PenIcon className="h-4 w-4 mr-1" />
                              Modifica
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!corso.giornateDiLezione || corso.giornateDiLezione.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                          Nessuna giornata di lezione programmata
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partecipanti tab content */}
        <TabsContent value="partecipanti" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Elenco Partecipanti</CardTitle>
                <CardDescription>Studenti iscritti al corso</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Esporta
                </Button>
                <Button size="sm" onClick={() => setIsAddingParticipant(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Aggiungi
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Codice Fiscale</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azienda</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.partecipantiList && corso.partecipantiList.map((partecipante, index) => (
                      <tr key={partecipante.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.cognome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.codiceFiscale || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-slate-500" />
                            <span>{partecipante.aziendaId ? getCompanyName(partecipante.aziendaId) : partecipante.azienda || "Non specificata"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditParticipant(partecipante)}
                            >
                              <PenIcon className="h-4 w-4 mr-1" />
                              Modifica
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDeleteParticipant(partecipante.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Elimina
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!corso.partecipantiList || corso.partecipantiList.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
                          Nessun partecipante iscritto
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Docenti e Tutor tab content */}
        <TabsContent value="docenti" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Docenti</CardTitle>
                <CardDescription>Professori e specialisti</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddingTeacher(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi Docente
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specializzazione</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.docentiList && corso.docentiList.map((docente, index) => (
                      <tr key={docente.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{docente.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{docente.cognome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{docente.specializzazione}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">Modifica</Button>
                        </td>
                      </tr>
                    ))}
                    {(!corso.docentiList || corso.docentiList.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                          Nessun docente assegnato
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tutor</CardTitle>
                <CardDescription>Assistenti e supporto</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddingTutor(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi Tutor
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ruolo</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.tutorList && corso.tutorList.map((tutor, index) => (
                      <tr key={tutor.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{tutor.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{tutor.cognome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{tutor.ruolo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">Modifica</Button>
                        </td>
                      </tr>
                    ))}
                    {(!corso.tutorList || corso.tutorList.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                          Nessun tutor assegnato
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
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
      
      {/* Delete Participant Confirmation Dialog */}
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

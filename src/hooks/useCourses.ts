
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Course {
  id: string;
  codice: string;
  titolo: string;
  edizioni: number;
  partecipanti: number;
  docenti: number;
  tutor: number;
  aziende: number;
  stato: string;
  dataCreazione?: string;
}

// Corsi predefiniti che non possono essere eliminati (solo quelli con id 1-5)
const defaultCourses = [
  {
    id: "1",
    codice: "FORM-001",
    titolo: "Sicurezza sul Lavoro",
    edizioni: 3,
    partecipanti: 28,
    docenti: 2,
    tutor: 1,
    aziende: 5,
    stato: "Completato"
  },
  {
    id: "2",
    codice: "FORM-002",
    titolo: "Marketing Digitale",
    edizioni: 1,
    partecipanti: 12,
    docenti: 1,
    tutor: 1,
    aziende: 3,
    stato: "In corso"
  },
  {
    id: "3",
    codice: "FORM-003",
    titolo: "Leadership e Team Management",
    edizioni: 2,
    partecipanti: 15,
    docenti: 2,
    tutor: 1,
    aziende: 4,
    stato: "Pianificato"
  },
  {
    id: "4",
    codice: "FORM-004",
    titolo: "Excel Avanzato",
    edizioni: 4,
    partecipanti: 30,
    docenti: 1,
    tutor: 2,
    aziende: 6,
    stato: "Completato"
  },
  {
    id: "5",
    codice: "FORM-005",
    titolo: "Tecniche di Vendita",
    edizioni: 2,
    partecipanti: 18,
    docenti: 1,
    tutor: 1,
    aziende: 3,
    stato: "In corso"
  }
];

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Funzione per caricare i corsi
  const loadCourses = useCallback(() => {
    setIsLoading(true);
    try {
      const storedCourses = localStorage.getItem('courses');
      const userCourses = storedCourses ? JSON.parse(storedCourses) : [];
      
      // Combina corsi predefiniti e corsi utente
      const allCourses = [...defaultCourses, ...userCourses].sort((a, b) => {
        const dateA = a.dataCreazione ? new Date(a.dataCreazione) : new Date(0);
        const dateB = b.dataCreazione ? new Date(b.dataCreazione) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setCourses(allCourses);
    } catch (error) {
      console.error('Errore nel caricamento dei corsi:', error);
      toast.error('Errore nel caricamento dei corsi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Funzione per eliminare un corso
  const deleteCourse = useCallback((courseId: string, confirmation: string) => {
    // Verifica se è un corso predefinito (id da 1 a 5)
    const isDefaultCourse = ['1', '2', '3', '4', '5'].includes(courseId);
    if (isDefaultCourse) {
      toast.error('Non è possibile eliminare un corso predefinito');
      return false;
    }
    
    // Trova il corso da eliminare
    const courseToDelete = courses.find(course => course.id === courseId);
    if (!courseToDelete) {
      toast.error('Corso non trovato');
      return false;
    }
    
    // Verifica la conferma
    if (confirmation !== courseToDelete.titolo) {
      toast.error('Il nome del corso non corrisponde');
      return false;
    }
    
    try {
      // Ottieni solo i corsi utente (non i predefiniti)
      const storedCourses = localStorage.getItem('courses') 
        ? JSON.parse(localStorage.getItem('courses')!) 
        : [];
      
      // Filtra il corso da eliminare
      const updatedCourses = storedCourses.filter((course: Course) => course.id !== courseId);
      
      // Salva la nuova lista di corsi
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      // Aggiorna lo stato
      loadCourses();
      
      toast.success('Corso eliminato con successo');
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione del corso:', error);
      toast.error('Errore nell\'eliminazione del corso');
      return false;
    }
  }, [courses, loadCourses]);

  // Carica i corsi al mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    courses,
    isLoading,
    loadCourses,
    deleteCourse
  };
};

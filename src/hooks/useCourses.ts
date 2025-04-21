
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  datacreazione?: string; // Changed from dataCreazione to datacreazione
  user_id?: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Funzione per caricare i corsi
  const loadCourses = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('datacreazione', { ascending: false }); // Changed from dataCreazione to datacreazione

      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Errore nel caricamento dei corsi:', error);
      toast.error('Errore nel caricamento dei corsi');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Funzione per eliminare un corso
  const deleteCourse = useCallback(async (courseId: string, confirmation: string) => {
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
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
      
      // Aggiorna lo stato
      await loadCourses();
      
      toast.success('Corso eliminato con successo');
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione del corso:', error);
      toast.error('Errore nell\'eliminazione del corso');
      return false;
    }
  }, [courses, loadCourses]);

  // Carica i corsi quando cambia l'utente
  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user, loadCourses]);

  return {
    courses,
    isLoading,
    loadCourses,
    deleteCourse
  };
};

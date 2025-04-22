
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useDetailedCourse = () => {
  const { id } = useParams<{ id: string }>();
  const [corso, setCorso] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!id) return;

      try {
        // First fetch the course data
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        
        // Then fetch lessons for this course
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', id);

        if (lessonsError) throw lessonsError;

        // Then fetch participants for this course
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select('*')
          .eq('course_id', id);

        if (participantsError) throw participantsError;

        // Then fetch teachers and tutors for this course
        const { data: teachersTutorsData, error: teachersTutorsError } = await supabase
          .from('teachers_tutors')
          .select('*')
          .eq('corso_id', id);

        if (teachersTutorsError) throw teachersTutorsError;
        
        console.log("Course detail loaded:", courseData);
        console.log("Lessons loaded:", lessonsData);
        
        if (courseData) {
          // Separate tutors from teachers
          const tutorList = teachersTutorsData?.filter((d: any) => d.tipo === 'tutor') || [];
          const docentiList = teachersTutorsData?.filter((d: any) => d.tipo === 'docente') || [];
          
          setCorso({
            ...courseData,
            giornateDiLezione: lessonsData || [],
            partecipantiList: participantsData || [],
            docentiList,
            tutorList,
            // Make sure course info has all required fields for CourseInfo component
            dataInizio: courseData.datainizio || '',
            dataFine: courseData.datafine || '',
            sede: courseData.sede || '',
            moduloFormativo: courseData.moduloformativo || ''
          });
        } else {
          toast.error('Corso non trovato');
        }
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Errore nel caricamento del corso');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [id]);

  // Function to add a new lesson
  const addLesson = async (lessonData: any) => {
    if (!id || !corso) {
      toast.error("ID corso non valido");
      return false;
    }

    try {
      const newLesson = {
        ...lessonData,
        course_id: id,
        user_id: corso.user_id
      };

      const { data, error } = await supabase
        .from('lessons')
        .insert(newLesson)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setCorso((prevCorso: any) => ({
        ...prevCorso,
        giornateDiLezione: [...prevCorso.giornateDiLezione, data]
      }));

      toast.success("Giornata aggiunta con successo");
      return true;
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Errore nell\'aggiungere la giornata');
      return false;
    }
  };

  // Function to update a lesson
  const updateLesson = async (lessonId: string, lessonData: any) => {
    if (!id || !corso) {
      toast.error("ID corso non valido");
      return false;
    }

    try {
      const { error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', lessonId);

      if (error) throw error;

      // Update local state
      setCorso((prevCorso: any) => ({
        ...prevCorso,
        giornateDiLezione: prevCorso.giornateDiLezione.map((lesson: any) =>
          lesson.id === lessonId ? { ...lesson, ...lessonData } : lesson
        )
      }));

      toast.success("Giornata aggiornata con successo");
      return true;
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Errore nell\'aggiornare la giornata');
      return false;
    }
  };

  // Function to delete a lesson
  const deleteLesson = async (lessonId: string) => {
    if (!id || !corso) {
      toast.error("ID corso non valido");
      return false;
    }

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      // Update local state
      setCorso((prevCorso: any) => ({
        ...prevCorso,
        giornateDiLezione: prevCorso.giornateDiLezione.filter(
          (lesson: any) => lesson.id !== lessonId
        )
      }));

      toast.success("Giornata eliminata con successo");
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Errore nell\'eliminare la giornata');
      return false;
    }
  };

  return { corso, setCorso, isLoading, addLesson, updateLesson, deleteLesson };
};

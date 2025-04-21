
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
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            giornateDiLezione:lessons(*),
            partecipantiList:participants(*),
            docentiList:teachers_tutors(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          // Separate tutors from teachers
          const tutorList = data.docentiList.filter((d: any) => d.tipo === 'tutor');
          const docentiList = data.docentiList.filter((d: any) => d.tipo === 'docente');
          
          setCorso({
            ...data,
            tutorList,
            docentiList
          });
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

  return { corso, setCorso, isLoading };
};

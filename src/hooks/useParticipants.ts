
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { Participant, DatabaseParticipant } from '@/types/participant';

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadParticipants = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('participants')
        .select('*');
      
      if (error) {
        console.error('Error loading participants:', error);
        toast.error('Errore nel caricamento dei partecipanti');
        return;
      }

      const transformedData: Participant[] = (data || []).map((dbParticipant: DatabaseParticipant) => ({
        id: dbParticipant.id,
        nome: dbParticipant.nome,
        cognome: dbParticipant.cognome,
        codicefiscale: dbParticipant.codicefiscale || '-',
        luogonascita: dbParticipant.luogonascita,
        datanascita: dbParticipant.datanascita,
        aziendaId: dbParticipant.aziendaid,
        azienda: dbParticipant.azienda,
        titolostudio: dbParticipant.titolostudio,
        qualifica: dbParticipant.qualifica,
        username: dbParticipant.username,
        numerocellulare: dbParticipant.numerocellulare,
        annoassunzione: dbParticipant.annoassunzione,
        contratto: dbParticipant.contratto
      }));
      
      setParticipants(transformedData);
    } catch (error) {
      console.error('Error in loadParticipants:', error);
      toast.error('Errore nel caricamento dei partecipanti');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  return {
    participants,
    isLoading,
    setIsLoading,
    loadParticipants
  };
};

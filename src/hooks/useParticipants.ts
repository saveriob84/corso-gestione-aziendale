
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { Participant, DatabaseParticipant } from '@/types/participant';

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const loadParticipants = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('cognome', { ascending: true });
      
      if (error) {
        console.error('Error loading participants:', error);
        toast.error('Errore nel caricamento dei partecipanti');
        return;
      }

      const transformedData: Participant[] = (data || []).map((dbParticipant: DatabaseParticipant) => ({
        id: dbParticipant.id,
        nome: dbParticipant.nome,
        cognome: dbParticipant.cognome,
        codicefiscale: dbParticipant.codicefiscale,
        luogonascita: dbParticipant.luogonascita,
        datanascita: dbParticipant.datanascita,
        aziendaid: dbParticipant.aziendaid,
        user_id: dbParticipant.user_id
      }));
      
      setParticipants(transformedData);
    } catch (error) {
      console.error('Error in loadParticipants:', error);
      toast.error('Errore nel caricamento dei partecipanti');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteParticipant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting participant:', error);
        toast.error('Errore nella eliminazione del partecipante');
        return false;
      }

      toast.success('Partecipante eliminato con successo');
      await loadParticipants();
      return true;
    } catch (error) {
      console.error('Error in deleteParticipant:', error);
      toast.error('Errore nella eliminazione del partecipante');
      return false;
    }
  };

  const filteredParticipants = participants.filter(participant => {
    const searchLower = searchQuery.toLowerCase();
    return (
      participant.nome?.toLowerCase().includes(searchLower) ||
      participant.cognome?.toLowerCase().includes(searchLower) ||
      participant.codicefiscale?.toLowerCase().includes(searchLower) ||
      participant.luogonascita?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    loadParticipants();
  }, []);

  return {
    participants: filteredParticipants,
    isLoading,
    setIsLoading,
    loadParticipants,
    deleteParticipant,
    searchQuery,
    setSearchQuery
  };
};

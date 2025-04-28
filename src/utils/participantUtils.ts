
import { supabase } from '@/integrations/supabase/client';
import { ParticipantFormValues } from '@/types/participant';

export const updateParticipant = async (
  id: string,
  data: ParticipantFormValues,
  aziendaDetails: { aziendaId?: string, azienda: string },
  formattedBirthDate: string | null
) => {
  // Create an update object with only defined values to prevent sending empty strings for UUID fields
  const updateData = {
    nome: data.nome,
    cognome: data.cognome,
    codicefiscale: data.codicefiscale || null,
    luogonascita: data.luogonascita || null,
    datanascita: formattedBirthDate,
    username: data.username || null,
    password: data.password || null,
    numerocellulare: data.numerocellulare || null,
    aziendaid: data.aziendaId || null,
    azienda: aziendaDetails.azienda,
    titolostudio: data.titolostudio || null,
    ccnl: data.ccnl || null,
    contratto: data.contratto || null,
    qualifica: data.qualifica || null,
    annoassunzione: data.annoassunzione || null,
  };

  return await supabase
    .from('participants')
    .update(updateData)
    .eq('id', id);
};

export const createParticipant = async (
  id: string,
  data: ParticipantFormValues,
  userId: string,
  aziendaDetails: { aziendaId?: string, azienda: string },
  formattedBirthDate: string | null,
  courseId?: string
) => {
  const insertData = {
    id: id,
    nome: data.nome,
    cognome: data.cognome,
    codicefiscale: data.codicefiscale || null,
    luogonascita: data.luogonascita || null,
    datanascita: formattedBirthDate,
    username: data.username || null,
    password: data.password || null,
    numerocellulare: data.numerocellulare || null,
    aziendaid: data.aziendaId || null,
    azienda: aziendaDetails.azienda,
    titolostudio: data.titolostudio || null,
    ccnl: data.ccnl || null,
    contratto: data.contratto || null,
    qualifica: data.qualifica || null,
    annoassunzione: data.annoassunzione || null,
    user_id: userId
  };

  const result = await supabase
    .from('participants')
    .insert(insertData);
    
  if (!result.error && courseId) {
    return await supabase
      .from('course_participants')
      .insert({
        course_id: courseId,
        participant_id: id,
        user_id: userId
      });
  }
  
  return result;
};

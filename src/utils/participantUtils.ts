
import { supabase } from '@/integrations/supabase/client';
import { ParticipantFormValues } from '@/types/participant';

export const updateParticipant = async (
  id: string,
  data: ParticipantFormValues,
  aziendaDetails: { aziendaId?: string, azienda: string },
  formattedBirthDate: string | null
) => {
  return await supabase
    .from('participants')
    .update({
      nome: data.nome,
      cognome: data.cognome,
      codicefiscale: data.codicefiscale,
      luogonascita: data.luogonascita,
      datanascita: formattedBirthDate,
      username: data.username,
      password: data.password,
      numerocellulare: data.numerocellulare,
      aziendaid: data.aziendaId,
      azienda: aziendaDetails.azienda,
      titolostudio: data.titolostudio,
      ccnl: data.ccnl,
      contratto: data.contratto,
      qualifica: data.qualifica,
      annoassunzione: data.annoassunzione,
    })
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
  const result = await supabase
    .from('participants')
    .insert({
      id: id,
      nome: data.nome,
      cognome: data.cognome,
      codicefiscale: data.codicefiscale,
      luogonascita: data.luogonascita,
      datanascita: formattedBirthDate,
      username: data.username,
      password: data.password,
      numerocellulare: data.numerocellulare,
      aziendaid: data.aziendaId,
      azienda: aziendaDetails.azienda,
      titolostudio: data.titolostudio,
      ccnl: data.ccnl,
      contratto: data.contratto,
      qualifica: data.qualifica,
      annoassunzione: data.annoassunzione,
      user_id: userId
    });
    
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


import { supabase } from '@/integrations/supabase/client';
import { ParticipantFormValues } from '@/types/participant';

export const updateParticipant = async (
  id: string,
  data: ParticipantFormValues
) => {
  // Create an update object with only defined values
  const updateData = {
    nome: data.nome,
    cognome: data.cognome,
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
  courseId?: string
) => {
  const insertData = {
    id: id,
    nome: data.nome,
    cognome: data.cognome,
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

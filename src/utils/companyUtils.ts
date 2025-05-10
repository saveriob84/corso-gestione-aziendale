
import { supabase } from '@/integrations/supabase/client';

export const findOrCreateCompany = async (companyData: any) => {
  if (!companyData.ragioneSociale) return undefined;

  try {
    const { data: existingCompanies, error: searchError } = await supabase
      .from('companies')
      .select('*')
      .eq('ragionesociale', companyData.ragioneSociale)
      .maybeSingle();

    if (searchError) {
      console.error('Error searching for company:', searchError);
      return undefined;
    }

    if (existingCompanies) {
      return existingCompanies.id;
    }

    const { data: newCompany, error: insertError } = await supabase
      .from('companies')
      .insert([{
        ragionesociale: companyData.ragioneSociale,
        partitaiva: companyData.partitaIva || '',
        indirizzo: companyData.indirizzo || '',
        comune: companyData.comune || '',
        cap: companyData.cap || '',
        provincia: companyData.provincia || '',
        telefono: companyData.telefono || '',
        email: companyData.email || '',
        referente: companyData.referente || '',
        codiceateco: companyData.codiceAteco || ''
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating company:', insertError);
      return undefined;
    }

    return newCompany.id;
  } catch (error) {
    console.error('Error in findOrCreateCompany:', error);
    return undefined;
  }
};

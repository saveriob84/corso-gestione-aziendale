
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ParticipantFormValues } from '@/types/participant';

export const useParticipantForm = (initialData: Partial<ParticipantFormValues> = {}, isOpen: boolean) => {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);

  const form = useForm<ParticipantFormValues>({
    defaultValues: {
      nome: initialData?.nome || "",
      cognome: initialData?.cognome || "",
      codicefiscale: initialData?.codicefiscale || "",
      luogonascita: initialData?.luogonascita || "",
      datanascita: initialData?.datanascita instanceof Date ? initialData.datanascita : undefined,
      username: initialData?.username || "",
      password: initialData?.password || "",
      numerocellulare: initialData?.numerocellulare || "",
      aziendaId: initialData?.aziendaId || "",
      exLege: initialData?.exLege || false,
      titolostudio: initialData?.titolostudio || "",
      ccnl: initialData?.ccnl || "",
      contratto: initialData?.contratto || "",
      qualifica: initialData?.qualifica || "",
      annoassunzione: initialData?.annoassunzione || new Date().getFullYear().toString(),
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        nome: initialData?.nome || "",
        cognome: initialData?.cognome || "",
        codicefiscale: initialData?.codicefiscale || "",
        luogonascita: initialData?.luogonascita || "",
        datanascita: initialData?.datanascita instanceof Date ? initialData.datanascita : undefined,
        username: initialData?.username || "",
        password: initialData?.password || "",
        numerocellulare: initialData?.numerocellulare || "",
        aziendaId: initialData?.aziendaId || "",
        exLege: initialData?.exLege || false,
        titolostudio: initialData?.titolostudio || "",
        ccnl: initialData?.ccnl || "",
        contratto: initialData?.contratto || "",
        qualifica: initialData?.qualifica || "",
        annoassunzione: initialData?.annoassunzione || new Date().getFullYear().toString(),
      });
    }
  }, [initialData, isOpen, form]);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase.from('companies').select('*');
        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error('Error loading companies:', error);
        toast.error("Errore nel caricamento delle aziende");
      }
    };
    
    fetchCompanies();
  }, [isCompanyFormOpen]);

  return {
    form,
    companies,
    isCompanyFormOpen,
    setIsCompanyFormOpen
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/participant';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface CompanySelectorProps {
  control: any;
  defaultValue?: string;
  name: string;
}

export const CompanySelector = ({ control, defaultValue, name }: CompanySelectorProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('ragionesociale', { ascending: true });
      
      if (error) {
        console.error('Error loading companies:', error);
        toast.error('Errore nel caricamento delle aziende');
        return;
      }
      
      console.log('Companies loaded from database:', data);
      
      // Transform the data to match our Company interface
      const transformedData: Company[] = (data || []).map(item => ({
        id: item.id,
        ragioneSociale: item.ragionesociale,
        partitaIva: item.partitaiva,
        indirizzo: item.indirizzo || '',
        comune: item.comune || '',
        cap: item.cap || '',
        provincia: item.provincia || '',
        telefono: item.telefono || '',
        email: item.email || '',
        referente: item.referente || '',
        codiceAteco: item.codiceateco || '',
        macrosettore: item.macrosettore
      }));
      
      console.log('Transformed companies data:', transformedData);
      setCompanies(transformedData);
    } catch (error) {
      console.error('Error in loadCompanies:', error);
      toast.error('Errore nel caricamento delle aziende');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const query = searchQuery.toLowerCase();
    return company.ragioneSociale.toLowerCase().includes(query);
  });

  console.log('Filtered companies:', filteredCompanies);
  console.log('Current search query:', searchQuery);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Azienda</FormLabel>
          <div className="space-y-2">
            <Input
              placeholder="Cerca azienda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <FormControl>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un'azienda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nessuna azienda</SelectItem>
                  {filteredCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.ragioneSociale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CompanySelector;

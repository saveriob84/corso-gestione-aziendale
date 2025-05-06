
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/participant';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompanySelectorProps {
  control: any;
  defaultValue?: string;
  name: string;
}

export const CompanySelector = ({ control, defaultValue, name }: CompanySelectorProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
        <FormItem className="flex flex-col">
          <FormLabel>Azienda</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {field.value && companies.length > 0
                    ? companies.find((company) => company.id === field.value)?.ragioneSociale || "Seleziona un'azienda"
                    : "Seleziona un'azienda"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <div className="flex items-center border-b px-3 py-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Cerca azienda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent p-1 focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div 
                  className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-accent"
                  onClick={() => {
                    field.onChange("none");
                    setOpen(false);
                  }}
                >
                  <span>Nessuna azienda</span>
                  {field.value === "none" && <Check className="h-4 w-4" />}
                </div>
                {filteredCompanies.length === 0 && searchQuery && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Nessuna azienda trovata
                  </div>
                )}
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-accent"
                    onClick={() => {
                      field.onChange(company.id);
                      setOpen(false);
                    }}
                  >
                    <div>
                      <p className="font-medium">{company.ragioneSociale}</p>
                      <p className="text-xs text-muted-foreground">{company.partitaIva}</p>
                    </div>
                    {field.value === company.id && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CompanySelector;

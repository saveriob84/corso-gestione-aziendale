
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ParticipantFormValues } from '@/types/participant';
import CompanyFormDialog from '../dialogs/CompanyFormDialog';

interface CompanySelectorProps {
  companies: any[];
  onAddCompany: () => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({ companies, onAddCompany }) => {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = React.useState(false);
  const { control, watch } = useFormContext<ParticipantFormValues>();
  
  // Monitor il valore dell'azienda selezionata
  const selectedCompanyId = watch('aziendaId');
  
  useEffect(() => {
    console.log('CompanySelector - Current companies:', companies);
    console.log('CompanySelector - Selected company ID:', selectedCompanyId);
    
    const selectedCompany = companies.find(company => company.id === selectedCompanyId);
    console.log('CompanySelector - Selected company:', selectedCompany);
  }, [selectedCompanyId, companies]);

  const handleOpenCompanyForm = () => {
    console.log('CompanySelector - Opening company form');
    onAddCompany();
    setIsCompanyFormOpen(true);
  };

  const handleCompanyChange = (value: string) => {
    console.log('CompanySelector - Company changed to:', value);
    return value;
  };

  return (
    <>
      <FormField
        control={control}
        name="aziendaId"
        render={({ field }) => {
          console.log('CompanySelector - field value:', field.value);
          return (
            <FormItem>
              <FormLabel>Azienda di appartenenza</FormLabel>
              <div className="flex space-x-2">
                <Select 
                  onValueChange={(value) => field.onChange(handleCompanyChange(value))}
                  value={field.value || ''}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleziona un'azienda" />
                  </SelectTrigger>
                  <SelectContent className="pointer-events-auto">
                    {companies.length > 0 ? 
                      companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.ragioneSociale}
                        </SelectItem>
                      )) : 
                      <SelectItem value="none" disabled>
                        Nessuna azienda disponibile
                      </SelectItem>
                    }
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleOpenCompanyForm}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <CompanyFormDialog 
        isOpen={isCompanyFormOpen}
        onClose={() => setIsCompanyFormOpen(false)}
      />
    </>
  );
};

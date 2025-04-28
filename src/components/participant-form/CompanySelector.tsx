
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ParticipantFormValues } from '@/types/participant';
import CompanyFormDialog from '../dialogs/CompanyFormDialog';

interface CompanySelectorProps {
  form: UseFormReturn<ParticipantFormValues>;
  companies: any[];
  onAddCompany: () => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({ form, companies, onAddCompany }) => {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = React.useState(false);

  const handleOpenCompanyForm = (e: React.MouseEvent) => {
    onAddCompany();
    setIsCompanyFormOpen(true);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="aziendaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Azienda di appartenenza</FormLabel>
            <div className="flex space-x-2">
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
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
        )}
      />

      <CompanyFormDialog 
        isOpen={isCompanyFormOpen}
        onClose={() => setIsCompanyFormOpen(false)}
      />
    </>
  );
};

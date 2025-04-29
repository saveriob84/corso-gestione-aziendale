
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import { PersonalInfoFields } from './PersonalInfoFields';
import { CredentialFields } from './CredentialFields';
import { EmploymentFields } from './EmploymentFields';
import { CompanySelector } from './CompanySelector';
import { UseFormReturn } from "react-hook-form";
import { ParticipantFormValues } from "@/types/participant";

interface ParticipantFormProps {
  form: UseFormReturn<ParticipantFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: ParticipantFormValues) => void;
  onCancel: () => void;
  companies: any[];
  onAddCompany: () => void;
  submitButtonLabel?: string;
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({
  form,
  isSubmitting = false,
  onSubmit,
  onCancel,
  companies,
  onAddCompany,
  submitButtonLabel = "Aggiungi"
}) => {
  // Log dei valori del form ad ogni renderizzazione e quando cambiano
  useEffect(() => {
    console.log('ParticipantForm - Current form values:', form.getValues());
    
    const subscription = form.watch((value) => {
      console.log('ParticipantForm - Form value changed:', value);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleFormSubmit = (values: ParticipantFormValues) => {
    console.log('ParticipantForm - Form submitted with values:', values);
    onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 w-full">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dati personali</h3>
              <PersonalInfoFields />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Credenziali</h3>
              <CredentialFields />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Azienda</h3>
              <CompanySelector 
                companies={companies}
                onAddCompany={onAddCompany}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dati lavorativi</h3>
              <EmploymentFields />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6 pt-2 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Elaborazione..." : submitButtonLabel}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

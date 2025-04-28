
import React from 'react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit(onSubmit)(e);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  return (
    <Form {...form}>
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PersonalInfoFields form={form} />
          <CredentialFields form={form} />
          
          <CompanySelector 
            form={form} 
            companies={companies}
            onAddCompany={onAddCompany}
          />

          <EmploymentFields form={form} />
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            className="pointer-events-auto"
          >
            Annulla
          </Button>
          <Button 
            onClick={handleSubmit}
            type="submit" 
            disabled={isSubmitting}
            className="pointer-events-auto"
          >
            {isSubmitting ? "Elaborazione..." : submitButtonLabel}
          </Button>
        </div>
      </div>
    </Form>
  );
};

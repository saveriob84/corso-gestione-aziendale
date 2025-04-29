
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ParticipantFormValues, ParticipantFormDialogProps } from '@/types/participant';
import { useParticipantForm } from '@/hooks/useParticipantForm';
import { useParticipantSubmit } from '@/hooks/useParticipantSubmit';
import { ParticipantForm } from '../participant-form/ParticipantForm';

interface ExtendedParticipantFormDialogProps extends ParticipantFormDialogProps {
  courseId?: string;
}

const ParticipantFormDialog: React.FC<ExtendedParticipantFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  courseId,
  onSuccess
}) => {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);

  useEffect(() => {
    console.log('ParticipantFormDialog - Open state:', isOpen);
    console.log('ParticipantFormDialog - Initial data:', initialData);
    console.log('ParticipantFormDialog - Is editing:', isEditing);
    console.log('ParticipantFormDialog - Course ID:', courseId);
  }, [isOpen, initialData, isEditing, courseId]);
  
  const {
    form,
    companies
  } = useParticipantForm(initialData, isOpen);
  
  const {
    isSubmitting,
    handleSubmit
  } = useParticipantSubmit(initialData, isEditing, courseId, onSuccess, onClose);
  
  const onSubmit = (data: ParticipantFormValues) => {
    console.log('ParticipantFormDialog - Form submitted:', data);
    handleSubmit(data, companies);
  };

  const handleOpenChange = (open: boolean) => {
    console.log('ParticipantFormDialog - Open state changing to:', open);
    if (!open) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Partecipante' : 'Aggiungi Partecipante'}</DialogTitle>
          <DialogDescription>Inserisci i dati del partecipante al corso</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <ParticipantForm 
            form={form} 
            isSubmitting={isSubmitting} 
            onSubmit={onSubmit} 
            onCancel={onClose} 
            companies={companies} 
            onAddCompany={() => setIsCompanyFormOpen(true)} 
            submitButtonLabel={isEditing ? 'Aggiorna' : 'Aggiungi'} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantFormDialog;

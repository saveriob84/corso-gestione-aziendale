import React, { useState } from 'react';
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
  const {
    form,
    companies
  } = useParticipantForm(initialData, isOpen);
  const {
    isSubmitting,
    handleSubmit
  } = useParticipantSubmit(initialData, isEditing, courseId, onSuccess, onClose);
  const onSubmit = (data: ParticipantFormValues) => {
    handleSubmit(data, companies);
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto pointer-events-none">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Partecipante' : 'Aggiungi Partecipante'}</DialogTitle>
          <DialogDescription>Inserisci i dati del partecipante al corso</DialogDescription>
        </DialogHeader>
        
        <ParticipantForm form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} onCancel={onClose} companies={companies} onAddCompany={() => setIsCompanyFormOpen(true)} submitButtonLabel={isEditing ? 'Aggiorna' : 'Aggiungi'} />
      </DialogContent>
    </Dialog>;
};
export default ParticipantFormDialog;
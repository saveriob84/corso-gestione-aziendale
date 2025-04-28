
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParticipantImportExport } from '@/hooks/useParticipantImportExport';
import { Participant } from '@/types/participant';

interface ParticipantImportExportProps {
  loadParticipants: () => Promise<void>;
  participants: Participant[];
  children: (props: {
    isLoading: boolean;
    downloadTemplate: () => void;
    triggerImportInput: () => void;
    handleExport: () => void;
    handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => React.ReactNode;
}

const ParticipantImportExport: React.FC<ParticipantImportExportProps> = ({
  loadParticipants,
  participants,
  children
}) => {
  const { user } = useAuth();
  
  const {
    isLoading,
    handleImport: importHandler,
    downloadTemplate,
    handleExport: exportHandler
  } = useParticipantImportExport(loadParticipants);
  
  const triggerImportInput = () => {
    document.getElementById('import-file')?.click();
  };
  
  const handleImportWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    importHandler(event, user?.id);
  };
  
  const handleExportWrapper = () => {
    exportHandler(participants);
  };
  
  return (
    <>
      {children({
        isLoading,
        downloadTemplate,
        triggerImportInput,
        handleExport: handleExportWrapper,
        handleImport: handleImportWrapper
      })}
      
      <input
        type="file"
        id="import-file"
        className="hidden"
        accept=".xlsx,.xls,.csv"
        onChange={handleImportWrapper}
        disabled={isLoading}
      />
    </>
  );
};

export default ParticipantImportExport;

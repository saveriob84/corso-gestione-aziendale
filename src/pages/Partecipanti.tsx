
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ImportInstructions } from "@/components/alerts/ImportInstructions";
import { useParticipants } from "@/hooks/useParticipants";
import { Participant, ParticipantFormValues } from '@/types/participant';
import { parseDateIfNeeded } from '@/utils/dateUtils';
import ParticipantFormDialog from "@/components/dialogs/ParticipantFormDialog";
import ParticipantHeader from "@/components/participants/ParticipantHeader";
import ParticipantTable from "@/components/participants/ParticipantTable";
import ParticipantImportExport from '@/components/participants/ParticipantImportExport';

const Partecipanti = () => {
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Partial<ParticipantFormValues> | null>(null);
  const { 
    participants, 
    isLoading, 
    loadParticipants,
    deleteParticipant,
    searchQuery,
    setSearchQuery
  } = useParticipants();

  const handleEdit = (participant: Participant) => {
    // Convert the participant object to match ParticipantFormValues
    // The key step here is to convert the datanascita string to a Date object
    const formattedParticipant: Partial<ParticipantFormValues> = {
      ...participant,
      datanascita: parseDateIfNeeded(participant.datanascita)
    };
    
    setEditingParticipant(formattedParticipant);
    setIsAddingParticipant(true);
  };

  const handleDelete = async (id: string) => {
    await deleteParticipant(id);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <ParticipantImportExport 
        loadParticipants={loadParticipants} 
        participants={participants}
      >
        {({ isLoading: importExportLoading, downloadTemplate, triggerImportInput, handleExport }) => (
          <ParticipantHeader
            isLoading={isLoading || importExportLoading}
            onDownloadTemplate={downloadTemplate}
            onImportClick={triggerImportInput}
            onAddParticipant={() => {
              setEditingParticipant(null);
              setIsAddingParticipant(true);
            }}
            onExport={handleExport}
          />
        )}
      </ParticipantImportExport>

      <ImportInstructions />

      <Card>
        <CardContent>
          <ParticipantTable 
            participants={participants}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </CardContent>
      </Card>

      <ParticipantFormDialog
        isOpen={isAddingParticipant}
        onClose={() => {
          setIsAddingParticipant(false);
          setEditingParticipant(null);
        }}
        initialData={editingParticipant || undefined}
        isEditing={!!editingParticipant}
        onSuccess={loadParticipants}
      />
    </div>
  );
};

export default Partecipanti;

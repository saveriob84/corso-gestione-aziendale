
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ImportInstructions } from "@/components/alerts/ImportInstructions";
import { useParticipants } from "@/hooks/useParticipants";
import { Participant, ParticipantFormValues } from '@/types/participant';
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
    console.log("Editing participant:", participant);
    
    const formattedParticipant: Partial<ParticipantFormValues> = {
      id: participant.id,
      nome: participant.nome,
      cognome: participant.cognome,
      codicefiscale: participant.codicefiscale,
      luogonascita: participant.luogonascita,
      datanascita: participant.datanascita,
      aziendaid: participant.aziendaid
    };
    
    setEditingParticipant(formattedParticipant);
    setIsAddingParticipant(true);
  };

  const handleDelete = async (id: string) => {
    await deleteParticipant(id);
  };

  const handleAddParticipant = () => {
    setEditingParticipant(null);
    setIsAddingParticipant(true);
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
            onAddParticipant={handleAddParticipant}
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
            onRefreshData={loadParticipants}
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

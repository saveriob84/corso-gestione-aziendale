
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Participant } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ParticipantTableProps {
  participants: Participant[];
  isLoading: boolean;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ParticipantTable = ({ 
  participants, 
  isLoading, 
  onEdit, 
  onDelete,
  searchQuery,
  onSearchChange
}: ParticipantTableProps) => {
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);

  const handleDeleteClick = (participant: Participant) => {
    setParticipantToDelete(participant);
  };

  const handleDeleteConfirm = async () => {
    if (participantToDelete) {
      await onDelete(participantToDelete.id);
      setParticipantToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Cerca per nome o cognome..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cognome</TableHead>
            <TableHead>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.nome}</TableCell>
              <TableCell>{participant.cognome}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(participant)}
                  >
                    <PenIcon className="h-4 w-4 mr-1" />
                    Modifica
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(participant)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Elimina
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {participants.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                {isLoading ? 'Caricamento...' : 'Nessun partecipante trovato'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!participantToDelete} onOpenChange={() => setParticipantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare il partecipante {participantToDelete?.nome} {participantToDelete?.cognome}?
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ParticipantTable;

import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { format, parse, isValid } from "date-fns";
import { it } from "date-fns/locale";
import { Participant } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenIcon, Trash2 } from "lucide-react";
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
import { useState } from "react";

interface ParticipantTableProps {
  participants: Participant[];
  isLoading: boolean;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const formatDateOfBirth = (dateString?: string): string => {
  if (!dateString) return '-';

  if (/^\d+$/.test(dateString)) {
    const date = new Date(1899, 11, 30);
    date.setDate(date.getDate() + parseInt(dateString));
    if (date.getFullYear() > 1920 && date.getFullYear() < new Date().getFullYear()) {
      return format(date, 'dd/MM/yyyy', { locale: it });
    }
  }

  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
  if (isValid(parsedDate)) {
    return format(parsedDate, 'dd/MM/yyyy', { locale: it });
  }

  const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'yyyy/MM/dd'];
  for (const formatString of formats) {
    const parsedDate = parse(dateString, formatString, new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, 'dd/MM/yyyy', { locale: it });
    }
  }

  return dateString;
};

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
          placeholder="Cerca per nome, cognome o codice fiscale..."
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
            <TableHead>Codice Fiscale</TableHead>
            <TableHead>Data di Nascita</TableHead>
            <TableHead>Azienda</TableHead>
            <TableHead>Titolo di Studio</TableHead>
            <TableHead>Qualifica</TableHead>
            <TableHead>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.nome}</TableCell>
              <TableCell>{participant.cognome}</TableCell>
              <TableCell>{participant.codicefiscale}</TableCell>
              <TableCell>{formatDateOfBirth(participant.datanascita)}</TableCell>
              <TableCell>{participant.azienda || '-'}</TableCell>
              <TableCell>{participant.titolostudio || '-'}</TableCell>
              <TableCell>{participant.qualifica || '-'}</TableCell>
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
              <TableCell colSpan={8} className="text-center py-4">
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

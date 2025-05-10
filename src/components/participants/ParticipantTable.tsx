
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Participant } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenIcon, Trash2, UserMinus } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ParticipantTableProps {
  participants: Participant[];
  isLoading: boolean;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefreshData?: () => void;
}

const ParticipantTable = ({ 
  participants, 
  isLoading, 
  onEdit, 
  onDelete,
  searchQuery,
  onSearchChange,
  onRefreshData
}: ParticipantTableProps) => {
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  const [participantToDisassociate, setParticipantToDisassociate] = useState<Participant | null>(null);
  const [isDisassociateDialogOpen, setIsDisassociateDialogOpen] = useState(false);

  const handleDeleteClick = (participant: Participant) => {
    setParticipantToDelete(participant);
  };

  const handleDeleteConfirm = async () => {
    if (participantToDelete) {
      await onDelete(participantToDelete.id);
      setParticipantToDelete(null);
    }
  };

  const handleDisassociateClick = (participant: Participant) => {
    if (participant.aziendaid) {
      setParticipantToDisassociate(participant);
      setIsDisassociateDialogOpen(true);
    } else {
      toast.info('Questo partecipante non è associato a nessuna azienda');
    }
  };

  const confirmDisassociateParticipant = async () => {
    if (!participantToDisassociate) return;
    
    try {
      // Update participant record to remove company association
      const { error } = await supabase
        .from('participants')
        .update({ aziendaid: null })
        .eq('id', participantToDisassociate.id);
      
      if (error) {
        console.error('Error disassociating participant from company:', error);
        toast.error('Errore nella rimozione del partecipante dall\'azienda');
        return;
      }
      
      toast.success('Partecipante rimosso dall\'azienda con successo');
      
      // Refresh the participants list if callback provided
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error('Error in confirmDisassociateParticipant:', error);
      toast.error('Errore nella rimozione del partecipante dall\'azienda');
    } finally {
      setIsDisassociateDialogOpen(false);
      setParticipantToDisassociate(null);
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
                  {participant.aziendaid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisassociateClick(participant)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Dissocia
                    </Button>
                  )}
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

      <AlertDialog open={isDisassociateDialogOpen} onOpenChange={setIsDisassociateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma disassociazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler rimuovere questo partecipante dall'azienda?
              {participantToDisassociate && (
                <div className="mt-2 p-3 bg-gray-100 rounded-md dark:bg-gray-800">
                  <p><strong>Nome:</strong> {participantToDisassociate.nome} {participantToDisassociate.cognome}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-orange-600 hover:bg-orange-700" 
              onClick={confirmDisassociateParticipant}
            >
              Dissocia
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ParticipantTable;

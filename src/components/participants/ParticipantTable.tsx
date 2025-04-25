
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { format, parse, isValid } from "date-fns";
import { it } from "date-fns/locale";
import { Participant } from "@/types/participant";

interface ParticipantTableProps {
  participants: Participant[];
  isLoading: boolean;
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

const ParticipantTable = ({ participants, isLoading }: ParticipantTableProps) => {
  return (
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
          </TableRow>
        ))}
        {participants.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              {isLoading ? 'Caricamento...' : 'Nessun partecipante trovato'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ParticipantTable;

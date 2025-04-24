export interface ParticipantFormValues {
  id?: string;
  nome: string;
  cognome: string;
  codicefiscale: string;
  luogoNascita: string;
  dataNascita: Date | undefined;
  username: string;
  password: string;
  cellulare: string;
  aziendaId: string;
  exLege: boolean;
  titoloStudio: string;
  ccnl: string;
  contratto: string;
  qualifica: string;
  annoAssunzione: string;
}

export interface Company {
  id: string;
  ragioneSociale: string;
  partitaIva: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
  telefono: string;
  email: string;
  referente: string;
  codiceAteco: string;
}

export interface ParticipantFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ParticipantFormValues>;
  isEditing?: boolean;
}

export interface DatabaseParticipant {
  id: string;
  nome: string;
  cognome: string;
  annoassunzione?: string;
  azienda?: string;
  aziendaid?: string;
  course_id?: string;
  qualifica?: string;
  ruolo?: string;
  user_id?: string;
  datanascita?: string;
  luogonascita?: string;
  codicefiscale?: string;
  titolostudio?: string;
  numerocellulare?: string;
  username?: string;
  password?: string;
  ccnl?: string;
  contratto?: string;
}

export interface Participant {
  id: string;
  nome: string;
  cognome: string;
  codicefiscale: string;
  luogoNascita?: string;
  dataNascita?: string;
  aziendaId?: string;
  azienda?: string;
  titoloStudio?: string;
  qualifica?: string;
  username?: string;
  password?: string;
  numeroCellulare?: string;
  ccnl?: string;
  contratto?: string;
  annoAssunzione?: string;
}

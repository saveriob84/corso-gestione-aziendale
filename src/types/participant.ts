export interface ParticipantFormValues {
  id?: string;
  nome: string;
  cognome: string;
  codicefiscale: string;
  luogonascita: string;
  datanascita: Date | undefined;
  username: string;
  password: string;
  numerocellulare: string;
  aziendaId: string;
  exLege: boolean;
  titolostudio: string;
  ccnl: string;
  contratto: string;
  qualifica: string;
  annoassunzione: string;
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
  macrosettore?: string;
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
  luogonascita?: string;
  datanascita?: string;
  aziendaId?: string;
  azienda?: string;
  titolostudio?: string;
  qualifica?: string;
  username?: string;
  password?: string;
  numerocellulare?: string;
  ccnl?: string;
  contratto?: string;
  annoassunzione?: string;
  user_id?: string;
}


export interface ParticipantFormValues {
  id?: string;
  nome: string;
  cognome: string;
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
  onSuccess?: () => void;
  courseId?: string;
}

export interface DatabaseParticipant {
  id: string;
  nome: string;
  cognome: string;
  user_id?: string;
}

export interface Participant {
  id: string;
  nome: string;
  cognome: string;
  user_id?: string;
}

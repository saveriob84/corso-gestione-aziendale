
export interface ParticipantFormValues {
  id?: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
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

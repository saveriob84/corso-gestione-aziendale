
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ImportInstructions = () => {
  return (
    <Alert>
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">Istruzioni per l'importazione:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Campi obbligatori partecipante:</strong> Nome, Cognome, Codice Fiscale</li>
            <li><strong>Campo obbligatorio azienda:</strong> Ragione Sociale Azienda (se si vuole associare il partecipante a un'azienda)</li>
            <li><strong>Formato data di nascita:</strong> GG/MM/AAAA</li>
            <li><strong>Codice Fiscale:</strong> verrà automaticamente convertito in maiuscolo</li>
            <li><strong>Associazione azienda:</strong> Se l'azienda esiste già (stessa ragione sociale o P.IVA), il partecipante verrà associato ad essa</li>
            <li><strong>Nuova azienda:</strong> Se l'azienda non esiste, verrà creata automaticamente con i dati forniti</li>
            <li>Gli altri campi sono opzionali</li>
            <li>Scarica il template Excel per vedere il formato corretto dei dati</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};

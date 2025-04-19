import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Download, FileText, PenIcon, Trash2, Upload, UserPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ParticipantListProps {
  partecipantiList: any[];
  onEditParticipant: (participantId: string) => void;
  onDeleteParticipant: (participantId: string) => void;
  onDownloadTemplate: () => void;
  onImportExcel: () => void;
  onLoadExistingParticipant: () => void;
  getCompanyName: (companyId: string) => string;
}

// Helper function to format date of birth
const formatDateOfBirth = (dateString?: string): string => {
  if (!dateString) return "-";

  // Check if it's a numeric value that needs formatting
  if (/^\d+$/.test(dateString)) {
    // Try to parse it as a day of the year (Excel sometimes stores dates this way)
    const date = new Date(1899, 11, 30);
    date.setDate(date.getDate() + parseInt(dateString));
    if (!isNaN(date.getTime()) && date.getFullYear() > 1920 && date.getFullYear() < new Date().getFullYear()) {
      return format(date, 'dd/MM/yyyy', { locale: it });
    }
  }

  // Try to parse as Date object directly
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return format(parsedDate, 'dd/MM/yyyy', { locale: it });
  }

  // Try to parse as DD/MM/YYYY format
  try {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!isNaN(date.getTime())) {
        return format(date, 'dd/MM/yyyy', { locale: it });
      }
    }
  } catch (e) {
    // Continue to other format attempts
  }

  // Return original string if we can't parse it
  return dateString;
};

// Helper function to map contract types
const getContractTypeName = (contractCode: string): string => {
  const contractTypes: Record<string, string> = {
    'determinato': 'Tempo determinato',
    'indeterminato': 'Tempo indeterminato',
    'apprendistato': 'Apprendistato',
    'stagionale': 'Stagionale',
    'collaborazione': 'Collaborazione',
    'partita-iva': 'Partita IVA'
  };
  
  return contractTypes[contractCode] || contractCode || '-';
};

// Helper function to map education titles
const getEducationTitle = (educationCode: string): string => {
  const educationTypes: Record<string, string> = {
    'licenzaMedia': 'Licenza media',
    'diplomaSuperiore': 'Diploma superiore',
    'laurea': 'Laurea',
    'masterPost': 'Master post-laurea',
    'dottorato': 'Dottorato'
  };
  
  return educationTypes[educationCode] || educationCode || '-';
};

const ParticipantList = ({
  partecipantiList,
  onEditParticipant,
  onDeleteParticipant,
  onDownloadTemplate,
  onImportExcel,
  onLoadExistingParticipant,
  getCompanyName
}: ParticipantListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Elenco Partecipanti</CardTitle>
          <CardDescription>Studenti iscritti al corso</CardDescription>
        </div>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
                <FileText className="mr-2 h-4 w-4" />
                Scarica Template Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              Scarica un template Excel con tutti i campi necessari per importare i partecipanti
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onImportExcel}>
                <Upload className="mr-2 h-4 w-4" />
                Importa Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              Importa un file Excel contenente l'elenco dei partecipanti
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onLoadExistingParticipant}>
                <UserPlus className="mr-2 h-4 w-4" />
                Carica Partecipante
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              Seleziona un partecipante già inserito in un altro corso
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Esporta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Codice Fiscale</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data Nascita</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Titolo Studio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contratto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azienda</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
              {partecipantiList && partecipantiList.map((partecipante, index) => (
                <tr key={partecipante.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.cognome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.codiceFiscale || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                    {formatDateOfBirth(partecipante.dataNascita)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                    {getEducationTitle(partecipante.titoloStudio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                    {getContractTypeName(partecipante.contratto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-slate-500" />
                      <span>{partecipante.aziendaId ? getCompanyName(partecipante.aziendaId) : partecipante.azienda || "Non specificata"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditParticipant(partecipante.id)}
                      >
                        <PenIcon className="h-4 w-4 mr-1" />
                        Modifica
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => onDeleteParticipant(partecipante.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Elimina
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!partecipantiList || partecipantiList.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-slate-500">
                    Nessun partecipante iscritto
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantList;

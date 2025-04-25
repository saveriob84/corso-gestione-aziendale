
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText, UserPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ParticipantHeaderProps {
  isLoading: boolean;
  onDownloadTemplate: () => void;
  onImportClick: () => void;
  onAddParticipant: () => void;
  onExport: () => void;
}

const ParticipantHeader = ({
  isLoading,
  onDownloadTemplate,
  onImportClick,
  onAddParticipant,
  onExport
}: ParticipantHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Elenco Partecipanti</h1>
        <p className="text-muted-foreground">Gestione partecipanti ai corsi</p>
      </div>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="default"
              onClick={onAddParticipant}
              disabled={isLoading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Nuovo Partecipante
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            Aggiungi un nuovo partecipante
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={onDownloadTemplate} disabled={isLoading}>
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
            <Button 
              variant="outline" 
              onClick={onImportClick}
              disabled={isLoading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? 'Importazione in corso...' : 'Importa Excel/CSV'}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            Importa un file Excel o CSV contenente l'elenco dei partecipanti
          </TooltipContent>
        </Tooltip>
        
        <Button variant="outline" onClick={onExport} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Esporta
        </Button>
      </div>
    </div>
  );
};

export default ParticipantHeader;

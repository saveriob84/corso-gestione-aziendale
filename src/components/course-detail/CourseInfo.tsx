
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CourseInfoProps {
  corso: {
    codice: string;
    titolo: string;
    dataInizio: string;
    dataFine: string;
    sede: string;
    moduloFormativo: string;
  };
}

const CourseInfo = ({ corso }: CourseInfoProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data non disponibile';
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Data non disponibile';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Corso</CardTitle>
          <CardDescription>Dati anagrafici del corso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Codice corso</p>
              <p>{corso.codice}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Titolo</p>
              <p>{corso.titolo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data inizio</p>
              <p>{formatDate(corso.dataInizio)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data fine</p>
              <p>{formatDate(corso.dataFine)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sede</p>
              <p>{corso.sede || 'Non specificata'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Modulo formativo</p>
              <p>{corso.moduloFormativo || 'Non specificato'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documenti</CardTitle>
          <CardDescription>File allegati al corso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center">
              <File className="h-10 w-10 text-slate-400" />
              <div className="ml-4">
                <p className="text-sm font-medium">Nessun documento caricato</p>
                <p className="text-sm text-slate-500">Carica i documenti relativi al corso</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Carica
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CourseInfo;

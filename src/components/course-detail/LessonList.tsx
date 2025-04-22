
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, PenIcon } from "lucide-react";
import { format } from "date-fns";

interface LessonListProps {
  giornateDiLezione: any[];
  onAddLesson: () => void;
  onEditLesson: (lesson: any) => void;
}

const LessonList = ({ giornateDiLezione, onAddLesson, onEditLesson }: LessonListProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data non disponibile';
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString || 'Data non disponibile';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Calendario Didattico</CardTitle>
          <CardDescription>Giornate di lezione programmate</CardDescription>
        </div>
        <Button size="sm" onClick={onAddLesson}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Aggiungi Giornata
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Orario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sede</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
              {giornateDiLezione && giornateDiLezione.length > 0 ? (
                giornateDiLezione.map((giornata, index) => (
                  <tr key={giornata.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{formatDate(giornata.data)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{giornata.orario}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{giornata.sede}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEditLesson(giornata)}
                        >
                          <PenIcon className="h-4 w-4 mr-1" />
                          Modifica
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                    Nessuna giornata di lezione programmata
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

export default LessonList;

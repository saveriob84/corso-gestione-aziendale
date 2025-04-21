
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onAddCourse: () => void;
}

const DashboardHeader = ({ onAddCourse }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
          Dashboard Corsi
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Gestisci i corsi di formazione e visualizza il loro stato
        </p>
      </div>
      <Button onClick={onAddCourse}>
        <Plus className="mr-2 h-4 w-4" />
        Nuovo Corso
      </Button>
    </div>
  );
};

export default DashboardHeader;


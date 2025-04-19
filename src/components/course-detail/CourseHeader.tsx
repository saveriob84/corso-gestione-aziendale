
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface CourseHeaderProps {
  corso: {
    titolo: string;
    codice: string;
  };
  onEditCourse: () => void;
  onGeneratePdf: () => void;
}

const CourseHeader = ({ corso, onEditCourse, onGeneratePdf }: CourseHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
          {corso.titolo}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Codice: {corso.codice}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onGeneratePdf}>
          <FileText className="mr-2 h-4 w-4" />
          Genera PDF
        </Button>
        <Button onClick={onEditCourse}>
          Modifica Corso
        </Button>
      </div>
    </div>
  );
};

export default CourseHeader;

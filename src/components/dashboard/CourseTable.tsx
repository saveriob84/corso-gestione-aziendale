
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, PenLine, FileText, Trash2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseTableProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCorsi: any[];
  onEditCourse: (corso: any) => void;
  onDeleteCourse: (corso: any) => void;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completato':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'In corso':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Pianificato':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  }
};

const CourseTable = ({ searchQuery, onSearchChange, filteredCorsi, onEditCourse, onDeleteCourse }: CourseTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestione Corsi</CardTitle>
        <CardDescription>Lista completa dei corsi di formazione</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cerca corso per codice o titolo..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtri avanzati
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codice</TableHead>
              <TableHead>Titolo corso</TableHead>
              <TableHead>Data creazione</TableHead>
              <TableHead>Edizioni</TableHead>
              <TableHead>Partecipanti</TableHead>
              <TableHead>Docenti</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Aziende</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCorsi.map((corso) => (
              <TableRow key={corso.id}>
                <TableCell className="font-medium">{corso.codice}</TableCell>
                <TableCell>{corso.titolo}</TableCell>
                <TableCell>
                  {corso.dataCreazione ? (
                    format(new Date(corso.dataCreazione), 'dd/MM/yyyy', { locale: it })
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{corso.edizioni}</TableCell>
                <TableCell>{corso.partecipanti}</TableCell>
                <TableCell>{corso.docenti}</TableCell>
                <TableCell>{corso.tutor}</TableCell>
                <TableCell>{corso.aziende}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(corso.stato)}>
                    {corso.stato}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/corsi/${corso.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => onEditCourse(corso)}>
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteCourse(corso)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CourseTable;


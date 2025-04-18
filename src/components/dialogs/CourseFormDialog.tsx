import React from 'react';
import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

interface CourseFormValues {
  id?: string;
  codice: string;
  titolo: string;
  dataInizio: string;
  dataFine: string;
  sede: string;
  moduloFormativo: string;
  dataCreazione?: string;
}

interface CourseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<CourseFormValues>;
  isEditing?: boolean;
  onCourseAdded?: (course: CourseFormValues) => void;
}

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  onCourseAdded
}) => {
  const navigate = useNavigate();
  
  const form = useForm<CourseFormValues>({
    defaultValues: {
      codice: initialData.codice || "",
      titolo: initialData.titolo || "",
      dataInizio: initialData.dataInizio || "",
      dataFine: initialData.dataFine || "",
      sede: initialData.sede || "",
      moduloFormativo: initialData.moduloFormativo || "",
    }
  });

  const onSubmit = (data: CourseFormValues) => {
    const existingCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    if (isEditing && initialData.id) {
      const updatedCourses = existingCourses.map(course => 
        course.id === initialData.id ? { ...course, ...data } : course
      );
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      toast.success("Corso aggiornato con successo");
    } else {
      const newCourse = {
        ...data,
        id: uuidv4(),
        dataCreazione: new Date().toISOString(),
        edizioni: 1,
        partecipanti: 0,
        docenti: 0,
        tutor: 0,
        aziende: 1,
        stato: "Pianificato",
        giornateDiLezione: [],
        partecipantiList: [],
        docentiList: [],
        tutorList: []
      };
      
      existingCourses.push(newCourse);
      localStorage.setItem('courses', JSON.stringify(existingCourses));
      toast.success("Corso aggiunto con successo");
      
      if (onCourseAdded) {
        onCourseAdded(newCourse);
      }
      
      setTimeout(() => {
        navigate(`/corsi/${newCourse.id}`);
      }, 500);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Corso' : 'Aggiungi Corso'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice corso</FormLabel>
                  <FormControl>
                    <Input placeholder="es. FORM-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="titolo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titolo corso</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Sicurezza sul Lavoro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dataInizio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data inizio</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dataFine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data fine</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sede</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Via Roma 123, Milano" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="moduloFormativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modulo formativo</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Sicurezza generale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
              <Button type="submit">{isEditing ? 'Aggiorna' : 'Aggiungi'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;

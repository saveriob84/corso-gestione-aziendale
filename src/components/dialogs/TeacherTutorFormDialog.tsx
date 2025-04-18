import React from 'react';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
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

interface TeacherTutorFormValues {
  id?: string;
  nome: string;
  cognome: string;
  specializzazione?: string;
  ruolo?: string;
}

interface TeacherTutorFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<TeacherTutorFormValues>;
  isEditing?: boolean;
  type: 'docente' | 'tutor';
}

const TeacherTutorFormDialog: React.FC<TeacherTutorFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  type
}) => {
  const { id: courseId } = useParams();
  
  const isDocente = type === 'docente';
  const listKey = isDocente ? 'docentiList' : 'tutorList';
  const countKey = isDocente ? 'docenti' : 'tutor';
  
  const form = useForm<TeacherTutorFormValues>({
    defaultValues: {
      nome: initialData.nome || "",
      cognome: initialData.cognome || "",
      specializzazione: initialData.specializzazione || "",
      ruolo: initialData.ruolo || "",
    }
  });

  const onSubmit = (data: TeacherTutorFormValues) => {
    if (!courseId) {
      toast.error("ID corso non valido");
      return;
    }
    
    console.log(`${type} form submitted:`, data);
    
    // Get existing courses
    const existingCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    // Find the course to update
    const courseIndex = existingCourses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) {
      toast.error("Corso non trovato");
      return;
    }
    
    // Create new teacher/tutor with ID
    const newPerson = {
      id: uuidv4(),
      ...data
    };
    
    // Initialize the list if it doesn't exist
    if (!existingCourses[courseIndex][listKey]) {
      existingCourses[courseIndex][listKey] = [];
    }
    
    if (isEditing && initialData.id) {
      // Update existing teacher/tutor
      const personIndex = existingCourses[courseIndex][listKey].findIndex(
        person => person.id === initialData.id
      );
      if (personIndex !== -1) {
        existingCourses[courseIndex][listKey][personIndex] = {
          ...existingCourses[courseIndex][listKey][personIndex],
          ...data
        };
      }
    } else {
      // Add new teacher/tutor
      existingCourses[courseIndex][listKey].push(newPerson);
      
      // Update count
      existingCourses[courseIndex][countKey] = 
        (existingCourses[courseIndex][countKey] || 0) + 1;
    }
    
    // Save updated courses
    localStorage.setItem('courses', JSON.stringify(existingCourses));
    
    // Show success message
    const entityName = isDocente ? "Docente" : "Tutor";
    toast.success(isEditing 
      ? `${entityName} aggiornato con successo` 
      : `${entityName} aggiunto con successo`
    );
    
    // Close the dialog
    onClose();
    
    // Force refresh to show the updated data
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? `Modifica ${isDocente ? 'Docente' : 'Tutor'}`
              : `Aggiungi ${isDocente ? 'Docente' : 'Tutor'}`
            }
          </DialogTitle>
          <DialogDescription>
            {`Aggiungi ${isDocente ? 'un docente' : 'un tutor'} al corso`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder={`es. ${isDocente ? 'Prof. Alberto' : 'Dott. Carlo'}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cognome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cognome</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Rossi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isDocente ? (
              <FormField
                control={form.control}
                name="specializzazione"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specializzazione</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Sicurezza sul lavoro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="ruolo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ruolo</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Tutor d'aula" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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

export default TeacherTutorFormDialog;

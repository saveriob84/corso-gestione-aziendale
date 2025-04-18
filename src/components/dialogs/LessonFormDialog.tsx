
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

interface LessonFormValues {
  id?: string; // Added id property
  data: string;
  orario: string;
  sede: string;
}

interface LessonFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<LessonFormValues>;
  isEditing?: boolean;
}

const LessonFormDialog: React.FC<LessonFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false
}) => {
  const { id: courseId } = useParams();
  
  const form = useForm<LessonFormValues>({
    defaultValues: {
      data: initialData.data || "",
      orario: initialData.orario || "",
      sede: initialData.sede || "",
    }
  });

  const onSubmit = (data: LessonFormValues) => {
    if (!courseId) {
      toast.error("ID corso non valido");
      return;
    }
    
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
    
    // Create new lesson with ID
    const newLesson = {
      id: uuidv4(),
      ...data
    };
    
    // Add lesson to course
    if (!existingCourses[courseIndex].giornateDiLezione) {
      existingCourses[courseIndex].giornateDiLezione = [];
    }
    
    if (isEditing && initialData.id) {
      // Update existing lesson
      const lessonIndex = existingCourses[courseIndex].giornateDiLezione.findIndex(
        lesson => lesson.id === initialData.id
      );
      if (lessonIndex !== -1) {
        existingCourses[courseIndex].giornateDiLezione[lessonIndex] = {
          ...existingCourses[courseIndex].giornateDiLezione[lessonIndex],
          ...data
        };
      }
    } else {
      // Add new lesson
      existingCourses[courseIndex].giornateDiLezione.push(newLesson);
    }
    
    // Save updated courses
    localStorage.setItem('courses', JSON.stringify(existingCourses));
    
    // Show success message
    toast.success(isEditing 
      ? "Giornata aggiornata con successo" 
      : "Giornata aggiunta con successo"
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
          <DialogTitle>{isEditing ? 'Modifica Giornata' : 'Aggiungi Giornata'}</DialogTitle>
          <DialogDescription>Aggiungi una giornata di lezione al corso</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="orario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orario</FormLabel>
                  <FormControl>
                    <Input placeholder="es. 09:00 - 13:00" {...field} />
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
                    <Input placeholder="es. Aula Magna" {...field} />
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

export default LessonFormDialog;

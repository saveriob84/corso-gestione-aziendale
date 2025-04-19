
import React from 'react';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface LessonFormValues {
  id?: string;
  data: Date | string;
  oraInizio: string;
  oraFine: string;
  sede: string;
  orario?: string; // Add orario property to fix TypeScript error
}

interface LessonFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<LessonFormValues>;
  isEditing?: boolean;
  onDelete?: () => void;
}

const LessonFormDialog: React.FC<LessonFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  onDelete
}) => {
  const { id: courseId } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  
  // Convert string data to Date object if needed, with null-checking
  const initialDate = initialData && initialData.data 
    ? typeof initialData.data === 'string'
      ? new Date(initialData.data)
      : initialData.data
    : undefined;

  // Extract hours from orario string if it exists, with null-checking
  const parseOrario = (orario?: string) => {
    if (!orario) return { oraInizio: '', oraFine: '' };
    
    const parts = orario.split(' - ');
    if (parts.length === 2) {
      return {
        oraInizio: parts[0],
        oraFine: parts[1]
      };
    }
    return { oraInizio: '', oraFine: '' };
  };
  
  // Safely access the orario property with null checking
  const { oraInizio, oraFine } = parseOrario(initialData && initialData.orario);
  
  const form = useForm<LessonFormValues>({
    defaultValues: {
      data: initialDate,
      oraInizio: initialData?.oraInizio || oraInizio || "",
      oraFine: initialData?.oraFine || oraFine || "",
      sede: initialData?.sede || "",
    }
  });

  const onSubmit = (values: LessonFormValues) => {
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

    // Format the date to string for storage
    const formattedDate = values.data instanceof Date 
      ? format(values.data, 'yyyy-MM-dd') 
      : values.data;

    // Combine ora inizio and ora fine
    const orario = `${values.oraInizio} - ${values.oraFine}`;
    
    // Create lesson data
    const lessonData = {
      id: initialData?.id || uuidv4(),
      data: formattedDate,
      orario,
      sede: values.sede
    };
    
    // Add lesson to course
    if (!existingCourses[courseIndex].giornateDiLezione) {
      existingCourses[courseIndex].giornateDiLezione = [];
    }
    
    if (isEditing && initialData?.id) {
      // Update existing lesson
      const lessonIndex = existingCourses[courseIndex].giornateDiLezione.findIndex(
        lesson => lesson.id === initialData.id
      );
      if (lessonIndex !== -1) {
        existingCourses[courseIndex].giornateDiLezione[lessonIndex] = lessonData;
      }
    } else {
      // Add new lesson
      existingCourses[courseIndex].giornateDiLezione.push(lessonData);
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

  const handleDelete = () => {
    if (!courseId || !initialData?.id) return;

    // Get existing courses
    const existingCourses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    // Find the course
    const courseIndex = existingCourses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) return;

    // Remove the lesson
    existingCourses[courseIndex].giornateDiLezione = existingCourses[courseIndex].giornateDiLezione.filter(
      (lesson) => lesson.id !== initialData.id
    );

    // Save updated courses
    localStorage.setItem('courses', JSON.stringify(existingCourses));
    
    toast.success("Giornata eliminata con successo");
    setIsDeleteDialogOpen(false);
    onClose();
    
    // Refresh to update UI
    window.location.reload();
  };

  // Function to get date constraints
  const getDateConstraints = () => {
    if (!courseId) return (date: Date) => false;

    const existingCourses = localStorage.getItem('courses')
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    const course = existingCourses.find(course => course.id === courseId);
    
    if (!course || !course.dataInizio || !course.dataFine) {
      return (date: Date) => false; // No constraints
    }

    const startDate = new Date(course.dataInizio);
    const endDate = new Date(course.dataFine);

    return (date: Date) => {
      return date < startDate || date > endDate;
    };
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifica Giornata' : 'Aggiungi Giornata'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifica i dettagli della giornata di lezione' 
                : 'Aggiungi una giornata di lezione al corso'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value instanceof Date 
                              ? format(field.value, "dd/MM/yyyy")
                              : field.value 
                                ? format(new Date(field.value), "dd/MM/yyyy") 
                                : <span>Seleziona una data</span>
                            }
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          disabled={getDateConstraints()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="oraInizio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ora Inizio</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="oraFine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ora Fine</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
              
              <DialogFooter className="flex-col sm:flex-row sm:justify-between">
                <div className="flex order-2 sm:order-1 mt-4 sm:mt-0 w-full sm:w-auto justify-start">
                  {isEditing && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Elimina
                    </Button>
                  )}
                </div>
                <div className="flex order-1 sm:order-2 space-x-2 w-full sm:w-auto justify-end">
                  <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
                  <Button type="submit">{isEditing ? 'Aggiorna' : 'Aggiungi'}</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questa giornata?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione è irreversibile. Tutti i dati relativi a questa giornata saranno eliminati permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LessonFormDialog;

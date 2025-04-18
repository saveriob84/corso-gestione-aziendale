
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

interface LessonFormValues {
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
  const form = useForm<LessonFormValues>({
    defaultValues: {
      data: initialData.data || "",
      orario: initialData.orario || "",
      sede: initialData.sede || "",
    }
  });

  const onSubmit = (data: LessonFormValues) => {
    // In a real app, this would save to a database
    console.log("Lesson form submitted:", data);
    
    // Show success message
    toast.success(isEditing 
      ? "Giornata aggiornata con successo" 
      : "Giornata aggiunta con successo"
    );
    
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Giornata' : 'Aggiungi Giornata'}</DialogTitle>
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

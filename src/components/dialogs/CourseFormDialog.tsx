
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

interface CourseFormValues {
  codice: string;
  titolo: string;
  dataInizio: string;
  dataFine: string;
  sede: string;
  moduloFormativo: string;
}

interface CourseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<CourseFormValues>;
  isEditing?: boolean;
}

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false
}) => {
  const form = useForm<CourseFormValues>({
    defaultValues: {
      codice: initialData.codice || "",
      titolo: initialData.titolo || "",
      dataInizio: initialData.dataInizio || "",
      dataFine: initialData.dataFine || "",
      sede: initialData.sede || "",
      moduloFormativo: initialData.moduloFormativo || ""
    }
  });

  const onSubmit = (data: CourseFormValues) => {
    // In a real app, this would save to a database
    console.log("Form submitted:", data);
    
    // Show success message
    toast.success(isEditing 
      ? "Corso aggiornato con successo" 
      : "Nuovo corso creato con successo"
    );
    
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Corso' : 'Nuovo Corso'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice Corso</FormLabel>
                  <FormControl>
                    <Input placeholder="FORM-XXX" {...field} />
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
                  <FormLabel>Titolo Corso</FormLabel>
                  <FormControl>
                    <Input placeholder="Titolo del corso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInizio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Inizio</FormLabel>
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
                    <FormLabel>Data Fine</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <Input placeholder="Indirizzo sede" {...field} />
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
                  <FormLabel>Modulo Formativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tipo di formazione" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
              <Button type="submit">{isEditing ? 'Aggiorna Corso' : 'Crea Corso'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;


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

interface TeacherTutorFormValues {
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
  const form = useForm<TeacherTutorFormValues>({
    defaultValues: {
      nome: initialData.nome || "",
      cognome: initialData.cognome || "",
      specializzazione: initialData.specializzazione || "",
      ruolo: initialData.ruolo || "",
    }
  });

  const isDocente = type === 'docente';
  const title = isDocente ? (isEditing ? 'Modifica Docente' : 'Aggiungi Docente') : 
                            (isEditing ? 'Modifica Tutor' : 'Aggiungi Tutor');

  const onSubmit = (data: TeacherTutorFormValues) => {
    // In a real app, this would save to a database
    console.log(`${type} form submitted:`, data);
    
    // Show success message
    toast.success(isEditing 
      ? `${isDocente ? 'Docente' : 'Tutor'} aggiornato con successo` 
      : `${isDocente ? 'Docente' : 'Tutor'} aggiunto con successo`
    );
    
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
                    <Input placeholder="Nome" {...field} />
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
                    <Input placeholder="Cognome" {...field} />
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
                      <Input placeholder="Specializzazione" {...field} />
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
                      <Input placeholder="Ruolo" {...field} />
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

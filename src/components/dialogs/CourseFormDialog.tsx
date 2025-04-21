import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';

// Schema for form validation
const formSchema = z.object({
  codice: z.string().min(3, {
    message: "Il codice deve contenere almeno 3 caratteri",
  }),
  titolo: z.string().min(3, {
    message: "Il titolo deve contenere almeno 3 caratteri",
  }),
  edizioni: z.coerce.number().int().positive(),
  partecipanti: z.coerce.number().int().nonnegative(),
  docenti: z.coerce.number().int().nonnegative(),
  tutor: z.coerce.number().int().nonnegative(),
  aziende: z.coerce.number().int().nonnegative(),
  stato: z.string().min(1, {
    message: "Seleziona lo stato del corso",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseAdded?: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const CourseFormDialog = ({
  isOpen,
  onClose,
  onCourseAdded,
  initialData,
  isEditing = false,
}: CourseFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Default form values
  const defaultValues = isEditing && initialData ? {
    codice: initialData.codice || "",
    titolo: initialData.titolo || "",
    edizioni: initialData.edizioni || 1,
    partecipanti: initialData.partecipanti || 0,
    docenti: initialData.docenti || 0,
    tutor: initialData.tutor || 0,
    aziende: initialData.aziende || 0,
    stato: initialData.stato || "Pianificato",
  } : {
    codice: "",
    titolo: "",
    edizioni: 1,
    partecipanti: 0,
    docenti: 0,
    tutor: 0,
    aziende: 0,
    stato: "Pianificato",
  };

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Reset form when dialog is opened or closed
  React.useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, form, defaultValues]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("Devi essere autenticato per eseguire questa operazione");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && initialData) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            codice: values.codice,
            titolo: values.titolo,
            edizioni: values.edizioni,
            partecipanti: values.partecipanti,
            docenti: values.docenti,
            tutor: values.tutor,
            aziende: values.aziende,
            stato: values.stato,
          })
          .eq('id', initialData.id);
          
        if (error) throw error;
        toast.success("Corso aggiornato con successo");
      } else {
        // Create new course
        const newCourse = {
          id: uuidv4(),
          codice: values.codice,
          titolo: values.titolo,
          edizioni: values.edizioni,
          partecipanti: values.partecipanti,
          docenti: values.docenti,
          tutor: values.tutor,
          aziende: values.aziende,
          stato: values.stato,
          datacreazione: new Date().toISOString(),
          user_id: user.id
        };
        
        const { error } = await supabase
          .from('courses')
          .insert(newCourse);
          
        if (error) throw error;
        toast.success("Corso creato con successo");
      }
      
      // Close dialog and refresh courses
      onClose();
      if (onCourseAdded) {
        onCourseAdded();
      }
    } catch (error: any) {
      console.error('Errore durante il salvataggio del corso:', error);
      toast.error(`Errore: ${error.message || 'Si è verificato un errore durante il salvataggio'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Corso" : "Nuovo Corso"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice</FormLabel>
                    <FormControl>
                      <Input placeholder="FORM-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona stato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pianificato">Pianificato</SelectItem>
                        <SelectItem value="In corso">In corso</SelectItem>
                        <SelectItem value="Completato">Completato</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="titolo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titolo corso</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome del corso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="edizioni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edizioni</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="partecipanti"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partecipanti</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="docenti"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Docenti</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tutor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutor</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aziende"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aziende</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? "Aggiornamento..."
                    : "Creazione..."
                  : isEditing
                  ? "Aggiorna"
                  : "Crea"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;

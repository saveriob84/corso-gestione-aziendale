
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const defaultValues = {
    codice: isEditing && initialData ? initialData.codice || "" : "",
    titolo: isEditing && initialData ? initialData.titolo || "" : "",
    edizioni: isEditing && initialData ? initialData.edizioni || 1 : 1,
    partecipanti: isEditing && initialData ? initialData.partecipanti || 0 : 0,
    docenti: isEditing && initialData ? initialData.docenti || 0 : 0,
    tutor: isEditing && initialData ? initialData.tutor || 0 : 0,
    aziende: isEditing && initialData ? initialData.aziende || 0 : 0,
    stato: isEditing && initialData ? initialData.stato || "Pianificato" : "Pianificato",
  };

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when dialog is opened or closed
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen]);

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Corso" : "Nuovo Corso"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifica i dettagli del corso esistente" : "Inserisci i dettagli per creare un nuovo corso"}
          </DialogDescription>
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
                      value={field.value}
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
                      <Input 
                        type="number" 
                        min="1"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value === '' ? 1 : value);
                        }}
                      />
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
                      <Input 
                        type="number" 
                        min="0"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value === '' ? 0 : value);
                        }}
                      />
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
                      <Input 
                        type="number" 
                        min="0"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value === '' ? 0 : value);
                        }}
                      />
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
                      <Input 
                        type="number" 
                        min="0"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? '' : Number(e.target.value);
                          field.onChange(value === '' ? 0 : value);
                        }}
                      />
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
                    <Input 
                      type="number" 
                      min="0"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value === '' ? 0 : value);
                      }}
                    />
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

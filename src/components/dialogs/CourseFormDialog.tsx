
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { it } from "date-fns/locale";

// Schema for form validation
const formSchema = z.object({
  codice: z.string().min(3, {
    message: "Il codice deve contenere almeno 3 caratteri",
  }),
  titolo: z.string().min(3, {
    message: "Il titolo deve contenere almeno 3 caratteri",
  }),
  stato: z.string().min(1, {
    message: "Seleziona lo stato del corso",
  }),
  datainizio: z.date().optional(),
  datafine: z.date().optional(),
  sede: z.string().optional(),
  moduloformativo: z.string().optional(),
  edizioni: z.coerce.number().int().positive(),
  partecipanti: z.coerce.number().int().nonnegative(),
  docenti: z.coerce.number().int().nonnegative(),
  tutor: z.coerce.number().int().nonnegative(),
  aziende: z.coerce.number().int().nonnegative(),
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

  // Parse dates from initialData if available
  const parseInitialDate = (dateString?: string) => {
    if (!dateString) return undefined;
    try {
      return new Date(dateString);
    } catch (e) {
      return undefined;
    }
  };

  // Default form values
  const defaultValues = {
    codice: isEditing && initialData ? initialData.codice || "" : "",
    titolo: isEditing && initialData ? initialData.titolo || "" : "",
    stato: isEditing && initialData ? initialData.stato || "Pianificato" : "Pianificato",
    datainizio: isEditing && initialData ? parseInitialDate(initialData.datainizio) : undefined,
    datafine: isEditing && initialData ? parseInitialDate(initialData.datafine) : undefined,
    sede: isEditing && initialData ? initialData.sede || "" : "",
    moduloformativo: isEditing && initialData ? initialData.moduloformativo || "" : "",
    edizioni: isEditing && initialData ? initialData.edizioni || 1 : 1,
    partecipanti: isEditing && initialData ? initialData.partecipanti || 0 : 0,
    docenti: isEditing && initialData ? initialData.docenti || 0 : 0,
    tutor: isEditing && initialData ? initialData.tutor || 0 : 0,
    aziende: isEditing && initialData ? initialData.aziende || 0 : 0,
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
      // Format dates for database
      const formatDateForDb = (date?: Date) => {
        return date ? date.toISOString() : null;
      };
      
      if (isEditing && initialData) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            codice: values.codice,
            titolo: values.titolo,
            stato: values.stato,
            datainizio: formatDateForDb(values.datainizio),
            datafine: formatDateForDb(values.datafine),
            sede: values.sede,
            moduloformativo: values.moduloformativo,
            edizioni: values.edizioni,
            partecipanti: values.partecipanti,
            docenti: values.docenti,
            tutor: values.tutor,
            aziende: values.aziende,
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
          stato: values.stato,
          datainizio: formatDateForDb(values.datainizio),
          datafine: formatDateForDb(values.datafine),
          sede: values.sede,
          moduloformativo: values.moduloformativo,
          edizioni: values.edizioni,
          partecipanti: values.partecipanti,
          docenti: values.docenti,
          tutor: values.tutor,
          aziende: values.aziende,
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
            
            {/* Date di inizio e fine corso */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="datainizio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data inizio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: it })
                            ) : (
                              <span>Seleziona data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="datafine"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data fine</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: it })
                            ) : (
                              <span>Seleziona data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Input placeholder="Via Roma 123, Milano" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moduloformativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modulo formativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Titolo del modulo formativo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Sezione dati statistici */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Dati statistici</h4>
              
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
                          {...field}
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
                          {...field}
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
                          {...field}
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
                          {...field}
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

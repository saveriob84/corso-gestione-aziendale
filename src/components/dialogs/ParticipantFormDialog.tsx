
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ParticipantFormValues } from '@/types/participant';
import { useParticipantSubmit } from '@/hooks/useParticipantSubmit';
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDateForDisplay, parseInitialDate } from '@/utils/dateUtils';
import CompanySelector from '@/components/participants/CompanySelector';

interface ExtendedParticipantFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ParticipantFormValues>;
  isEditing?: boolean;
  courseId?: string;
  onSuccess?: () => void;
}

const ParticipantFormDialog: React.FC<ExtendedParticipantFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  courseId,
  onSuccess
}) => {
  const form = useForm<ParticipantFormValues>({
    defaultValues: {
      nome: initialData?.nome || "",
      cognome: initialData?.cognome || "",
      codicefiscale: initialData?.codicefiscale || "",
      luogonascita: initialData?.luogonascita || "",
      datanascita: initialData?.datanascita || "",
      aziendaid: initialData?.aziendaid || ""
    }
  });
  
  const {
    isSubmitting,
    handleSubmit
  } = useParticipantSubmit(initialData, isEditing, courseId, onSuccess, onClose);
  
  const onSubmit = (data: ParticipantFormValues) => {
    console.log("Form submitted with data:", data);
    handleSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Partecipante' : 'Aggiungi Partecipante'}</DialogTitle>
          <DialogDescription>Inserisci i dati del partecipante al corso</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="es. Mario" 
                            {...field} 
                          />
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
                          <Input 
                            placeholder="es. Rossi" 
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
                  name="codicefiscale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="es. RSSMRA80A01H501X" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="luogonascita"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luogo di Nascita</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="es. Roma" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="datanascita"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data di Nascita</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <CompanySelector 
                  control={form.control}
                  name="aziendaid"
                  defaultValue={initialData?.aziendaid}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                  >
                    Annulla
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Elaborazione..." : isEditing ? "Aggiorna" : "Aggiungi"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantFormDialog;

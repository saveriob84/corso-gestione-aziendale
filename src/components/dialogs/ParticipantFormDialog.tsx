
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ParticipantFormValues } from '@/types/participant';
import { useParticipantSubmit } from '@/hooks/useParticipantSubmit';
import { useForm } from "react-hook-form";
import { FormProvider, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    }
  });
  
  const {
    isSubmitting,
    handleSubmit
  } = useParticipantSubmit(initialData, isEditing, courseId, onSuccess, onClose);
  
  const onSubmit = (data: ParticipantFormValues) => {
    console.log("Form submitted with data:", data);
    handleSubmit(data, []);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Partecipante' : 'Aggiungi Partecipante'}</DialogTitle>
          <DialogDescription>Inserisci i dati del partecipante al corso</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
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
                
                <div className="flex justify-end space-x-2 pt-2">
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
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantFormDialog;

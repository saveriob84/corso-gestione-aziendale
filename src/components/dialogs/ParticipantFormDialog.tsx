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

interface ParticipantFormValues {
  id?: string;
  nome: string;
  cognome: string;
  azienda: string;
  ruolo: string;
}

interface ParticipantFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ParticipantFormValues>;
  isEditing?: boolean;
}

const ParticipantFormDialog: React.FC<ParticipantFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false
}) => {
  const { id: courseId } = useParams();
  
  const form = useForm<ParticipantFormValues>({
    defaultValues: {
      nome: initialData.nome || "",
      cognome: initialData.cognome || "",
      azienda: initialData.azienda || "",
      ruolo: initialData.ruolo || "",
    }
  });

  const onSubmit = (data: ParticipantFormValues) => {
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
    
    // Create new participant with ID
    const newParticipant = {
      id: uuidv4(),
      ...data
    };
    
    // Add participant to course
    if (!existingCourses[courseIndex].partecipantiList) {
      existingCourses[courseIndex].partecipantiList = [];
    }
    
    if (isEditing && initialData.id) {
      // Update existing participant
      const participantIndex = existingCourses[courseIndex].partecipantiList.findIndex(
        participant => participant.id === initialData.id
      );
      if (participantIndex !== -1) {
        existingCourses[courseIndex].partecipantiList[participantIndex] = {
          ...existingCourses[courseIndex].partecipantiList[participantIndex],
          ...data
        };
      }
    } else {
      // Add new participant
      existingCourses[courseIndex].partecipantiList.push(newParticipant);
      
      // Update participant count
      existingCourses[courseIndex].partecipanti = 
        (existingCourses[courseIndex].partecipanti || 0) + 1;
    }
    
    // Save updated courses
    localStorage.setItem('courses', JSON.stringify(existingCourses));
    
    // Show success message
    toast.success(isEditing 
      ? "Partecipante aggiornato con successo" 
      : "Partecipante aggiunto con successo"
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
          <DialogTitle>{isEditing ? 'Modifica Partecipante' : 'Aggiungi Partecipante'}</DialogTitle>
          <DialogDescription>Aggiungi un partecipante al corso</DialogDescription>
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
                    <Input placeholder="es. Mario" {...field} />
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
                    <Input placeholder="es. Rossi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="azienda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Azienda</FormLabel>
                  <FormControl>
                    <Input placeholder="es. TechSolutions Srl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ruolo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ruolo</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Tecnico" {...field} />
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

export default ParticipantFormDialog;

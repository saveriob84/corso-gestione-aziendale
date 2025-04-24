
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface Participant {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale?: string;
  dataNascita?: string;
  azienda?: string;
  titoloStudio?: string;
  qualifica?: string;
}

interface ParticipantSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectParticipant: (participant: Participant) => void;
  courseId?: string;
}

const ParticipantSearchDialog = ({
  isOpen,
  onClose,
  onSelectParticipant,
  courseId
}: ParticipantSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [existingParticipantIds, setExistingParticipantIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) {
        console.error('No courseId provided to ParticipantSearchDialog');
        return;
      }

      setIsLoading(true);

      try {
        // First fetch existing participant IDs for this course to filter them out
        const { data: courseParticipants, error: participantsError } = await supabase
          .from('participants')
          .select('id')
          .eq('course_id', courseId);

        if (participantsError) {
          console.error('Error fetching course participants:', participantsError);
          // Fallback to localStorage
          const courses = JSON.parse(localStorage.getItem('courses') || '[]');
          const currentCourse = courses.find((c: any) => c.id === courseId);
          
          if (currentCourse?.partecipantiList) {
            setExistingParticipantIds(currentCourse.partecipantiList.map((p: any) => p.id));
          } else {
            setExistingParticipantIds([]);
          }
        } else if (courseParticipants) {
          setExistingParticipantIds(courseParticipants.map(p => p.id));
        } else {
          setExistingParticipantIds([]);
        }

        console.log('Existing participant IDs:', existingParticipantIds);

        // Load ALL participants regardless of course (these are the ones we can add)
        console.log('Fetching all participants from database...');
        const { data: allParticipantsData, error: allParticipantsError } = await supabase
          .from('participants')
          .select('*')
          .is('course_id', null); // Get participants not assigned to any course

        if (allParticipantsError) {
          console.error('Error fetching all participants:', allParticipantsError);
          toast.error('Errore nel caricamento dei partecipanti');
        } else if (allParticipantsData && allParticipantsData.length > 0) {
          console.log('Fetched participants:', allParticipantsData.length, 'participants');
          
          // Map the database fields to our interface
          const mappedParticipants: Participant[] = allParticipantsData.map(p => ({
            id: p.id || '',
            nome: p.nome || '',
            cognome: p.cognome || '',
            codiceFiscale: undefined, // Field doesn't exist in Supabase
            dataNascita: p.annoassunzione || '',
            azienda: p.azienda || '',
            titoloStudio: p.ruolo || '',
            qualifica: p.qualifica || ''
          }));
          
          console.log('Mapped participants:', mappedParticipants);
          setParticipants(mappedParticipants);
        } else {
          console.log('No unassigned participants found in database');
          // Try fetching all participants without the course_id filter
          const { data: allParticipants, error: fetchError } = await supabase
            .from('participants')
            .select('*');
            
          if (fetchError) {
            console.error('Error fetching any participants:', fetchError);
            toast.error('Errore nel caricamento dei partecipanti');
          } else if (allParticipants && allParticipants.length > 0) {
            console.log('Fetched all participants:', allParticipants.length);
            
            const mappedParticipants: Participant[] = allParticipants.map(p => ({
              id: p.id || '',
              nome: p.nome || '',
              cognome: p.cognome || '',
              codiceFiscale: undefined,
              dataNascita: p.annoassunzione || '',
              azienda: p.azienda || '',
              titoloStudio: p.ruolo || '',
              qualifica: p.qualifica || ''
            }));
            
            setParticipants(mappedParticipants);
          } else {
            console.log('No participants found at all');
            setParticipants([]);
          }
        }
      } catch (error) {
        console.error('Error in loadData:', error);
        toast.error('Errore nel caricamento dei partecipanti');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      setSearchTerm(''); // Reset search term when dialog opens
      loadData();
    }
  }, [courseId, isOpen]);

  useEffect(() => {
    // Filter participants based on search term and exclude those already in the course
    if (!searchTerm) {
      // If no search term, show nothing to avoid overwhelming the user
      setFilteredParticipants([]);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    const filtered = participants.filter(p => {
      // Check if this participant is already in the course
      const isAlreadyInCourse = existingParticipantIds.includes(p.id);
      if (isAlreadyInCourse) {
        return false;
      }
      
      // Check if nome matches (safely)
      const nameMatches = p.nome ? p.nome.toLowerCase().includes(searchTermLower) : false;
      
      // Check if cognome matches (safely)
      const surnameMatches = p.cognome ? p.cognome.toLowerCase().includes(searchTermLower) : false;
      
      return nameMatches || surnameMatches;
    });
    
    console.log('Search term:', searchTermLower);
    console.log('Filtered participants:', filtered.length, 'out of', participants.length);
    console.log('Excluded IDs:', existingParticipantIds);
    
    setFilteredParticipants(filtered);
  }, [searchTerm, participants, existingParticipantIds]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleziona Partecipante</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome o cognome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-4">Caricamento partecipanti...</p>
          ) : filteredParticipants.length > 0 ? (
            <div className="space-y-2">
              {filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                  onClick={() => {
                    onSelectParticipant(participant);
                    onClose();
                  }}
                >
                  <div>
                    <p className="font-medium">{`${participant.nome || ''} ${participant.cognome || ''}`}</p>
                    <p className="text-sm text-muted-foreground">{participant.qualifica || participant.azienda || ''}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Aggiungi al corso
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {searchTerm 
                ? participants.length > 0 
                  ? "Nessun partecipante trovato" 
                  : "Nessun partecipante disponibile nel database" 
                : "Inizia a digitare per cercare i partecipanti"}
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantSearchDialog;

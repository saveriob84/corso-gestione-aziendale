
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

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) {
        console.error('No courseId provided to ParticipantSearchDialog');
        return;
      }

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
          }
        } else if (courseParticipants) {
          setExistingParticipantIds(courseParticipants.map(p => p.id));
        } else {
          setExistingParticipantIds([]);
        }

        console.log('Fetching all participants from Supabase...');
        // Load all participants from Supabase
        const { data: allParticipants, error: allParticipantsError } = await supabase
          .from('participants')
          .select('*');

        if (allParticipantsError) {
          console.error('Error fetching all participants:', allParticipantsError);
          // Fallback to localStorage
          const allLocalParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
          setParticipants(allLocalParticipants);
          console.log('Loaded participants from localStorage:', allLocalParticipants);
        } else if (allParticipants) {
          console.log('Fetched all participants from Supabase:', allParticipants);
          
          // Print a sample participant to see the actual structure
          if (allParticipants.length > 0) {
            console.log('Sample participant structure:', JSON.stringify(allParticipants[0]));
          }
          
          // Map the database fields to our interface carefully based on the actual DB schema
          const mappedParticipants: Participant[] = allParticipants.map(p => {
            // Create a participant object that matches our interface
            const participant: Participant = {
              id: p.id || '',
              nome: p.nome || '',
              cognome: p.cognome || '',
              codiceFiscale: undefined, // Field doesn't exist in Supabase
              azienda: p.azienda || '',
              qualifica: p.qualifica || ''
            };
            
            // Map other fields that do exist in the database
            if (p.annoassunzione) participant.dataNascita = p.annoassunzione;
            if (p.ruolo) participant.titoloStudio = p.ruolo;
            
            return participant;
          });
          
          console.log('Mapped participants:', mappedParticipants);
          setParticipants(mappedParticipants);
        } else {
          // Final fallback to localStorage if no data
          const allLocalParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
          setParticipants(allLocalParticipants);
          console.log('No data from Supabase, using localStorage:', allLocalParticipants);
        }
      } catch (error) {
        console.error('Error in loadData:', error);
        // Fallback to localStorage as last resort
        const allLocalParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
        setParticipants(allLocalParticipants);
        console.log('Error caught, using localStorage:', allLocalParticipants);
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
      
      // We no longer check codiceFiscale since it doesn't exist in the database
      
      return nameMatches || surnameMatches;
    });
    
    console.log('Search term:', searchTerm);
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
          {filteredParticipants.length > 0 ? (
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
              {searchTerm ? "Nessun partecipante trovato" : "Inizia a digitare per cercare i partecipanti"}
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantSearchDialog;

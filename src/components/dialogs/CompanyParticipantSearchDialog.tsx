
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Participant } from '@/types/participant';

interface CompanyParticipantSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectParticipant: (participant: Participant) => void;
  companyId: string;
}

const CompanyParticipantSearchDialog = ({
  isOpen,
  onClose,
  onSelectParticipant,
  companyId
}: CompanyParticipantSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!companyId) {
        console.error('No companyId provided to ParticipantSearchDialog');
        return;
      }

      setIsLoading(true);

      try {
        // Load participants that do not belong to this company
        const { data: allParticipantsData, error: allParticipantsError } = await supabase
          .from('participants')
          .select('*')
          .is('aziendaid', null); // Get participants without a company

        if (allParticipantsError) {
          console.error('Error fetching participants:', allParticipantsError);
          toast.error('Errore nel caricamento dei partecipanti');
        } else if (allParticipantsData && allParticipantsData.length > 0) {
          console.log('Fetched participants:', allParticipantsData.length, 'participants');
          
          // Map the database fields to our interface
          const mappedParticipants: Participant[] = allParticipantsData.map(p => ({
            id: p.id || '',
            nome: p.nome || '',
            cognome: p.cognome || '',
            codicefiscale: p.codicefiscale,
            luogonascita: p.luogonascita,
            datanascita: p.datanascita,
            aziendaid: p.aziendaid,
            user_id: p.user_id
          }));
          
          setParticipants(mappedParticipants);
        } else {
          console.log('No unassigned participants found in database');
          setParticipants([]);
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
  }, [companyId, isOpen]);

  useEffect(() => {
    // Filter participants based on search term
    if (!searchTerm) {
      // If no search term, show nothing to avoid overwhelming the user
      setFilteredParticipants([]);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    const filtered = participants.filter(p => {
      // Check if nome matches (safely)
      const nameMatches = p.nome ? p.nome.toLowerCase().includes(searchTermLower) : false;
      
      // Check if cognome matches (safely)
      const surnameMatches = p.cognome ? p.cognome.toLowerCase().includes(searchTermLower) : false;
      
      // Check if codicefiscale matches (safely)
      const cfMatches = p.codicefiscale ? p.codicefiscale.toLowerCase().includes(searchTermLower) : false;
      
      return nameMatches || surnameMatches || cfMatches;
    });
    
    console.log('Search term:', searchTermLower);
    console.log('Filtered participants:', filtered.length, 'out of', participants.length);
    
    setFilteredParticipants(filtered);
  }, [searchTerm, participants]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleziona Partecipante</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome, cognome o codice fiscale..."
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
                    <p className="text-sm text-muted-foreground">{participant.codicefiscale || ''}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Associa all'azienda
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {searchTerm 
                ? participants.length > 0 
                  ? "Nessun partecipante trovato" 
                  : "Nessun partecipante disponibile" 
                : "Inizia a digitare per cercare i partecipanti"}
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyParticipantSearchDialog;


import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus } from "lucide-react";

interface Participant {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  dataNascita?: string;
  azienda?: string;
  titoloStudio?: string;
  qualifica?: string;
}

interface ParticipantSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectParticipant: (participant: Participant) => void;
  courseId?: string; // Added courseId as an optional prop
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

  useEffect(() => {
    // Load all participants from localStorage
    const allParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
    setParticipants(allParticipants);
  }, []);

  useEffect(() => {
    // Filter participants based on search term
    const filtered = participants.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codiceFiscale.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
                    <p className="font-medium">{`${participant.nome} ${participant.cognome}`}</p>
                    <p className="text-sm text-muted-foreground">{participant.codiceFiscale}</p>
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

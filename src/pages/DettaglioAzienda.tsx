
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Building, Edit, Trash2, Users, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CompanyFormDialog from '@/components/dialogs/CompanyFormDialog';
import { Company, Participant } from '@/types/participant';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CompanyParticipantSearchDialog from '@/components/dialogs/CompanyParticipantSearchDialog';

interface ParticipantExtended extends Participant {
  qualifica?: string;
  annoassunzione?: string;
}

const DettaglioAzienda: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [participants, setParticipants] = useState<ParticipantExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isParticipantSearchDialogOpen, setIsParticipantSearchDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadCompanyDetails(id);
    }
  }, [id]);

  const loadCompanyDetails = async (companyId: string) => {
    setIsLoading(true);
    try {
      // Fetch company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (companyError) {
        console.error('Error loading company:', companyError);
        toast.error('Errore nel caricamento dei dettagli dell\'azienda');
        navigate('/aziende');
        return;
      }
      
      if (!companyData) {
        toast.error('Azienda non trovata');
        navigate('/aziende');
        return;
      }

      // Transform the data to match our Company interface
      const transformedCompany: Company = {
        id: companyData.id,
        ragioneSociale: companyData.ragionesociale,
        partitaIva: companyData.partitaiva,
        indirizzo: companyData.indirizzo || '',
        comune: companyData.comune || '',
        cap: companyData.cap || '',
        provincia: companyData.provincia || '',
        telefono: companyData.telefono || '',
        email: companyData.email || '',
        referente: companyData.referente || '',
        codiceAteco: companyData.codiceateco || '',
        macrosettore: companyData.macrosettore
      };
      
      setCompany(transformedCompany);
      
      // Fetch participants associated with this company
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('id, nome, cognome, qualifica, annoassunzione, codicefiscale, datanascita, luogonascita, user_id')
        .eq('aziendaid', companyId);
      
      if (participantsError) {
        console.error('Error loading participants:', participantsError);
        toast.error('Errore nel caricamento dei partecipanti');
      } else {
        setParticipants(participantsData || []);
      }
    } catch (error) {
      console.error('Error in loadCompanyDetails:', error);
      toast.error('Errore nel caricamento dei dettagli');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCompany = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteCompany = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!company) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Azienda eliminata con successo');
      navigate('/aziende');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Errore durante l\'eliminazione dell\'azienda');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCompanyUpdated = (updatedCompany: Company) => {
    setCompany(updatedCompany);
    toast.success('Azienda aggiornata con successo');
  };

  const handleAddParticipant = () => {
    setIsParticipantSearchDialogOpen(true);
  };

  const handleAssociateParticipant = async (participant: Participant) => {
    if (!company) return;
    
    try {
      // Update participant record to associate with this company
      const { error } = await supabase
        .from('participants')
        .update({ aziendaid: company.id })
        .eq('id', participant.id);
      
      if (error) {
        console.error('Error associating participant with company:', error);
        toast.error('Errore nell\'associazione del partecipante all\'azienda');
        return;
      }
      
      toast.success('Partecipante associato all\'azienda con successo');
      
      // Refresh the participants list
      loadCompanyDetails(company.id);
    } catch (error) {
      console.error('Error in handleAssociateParticipant:', error);
      toast.error('Errore nell\'associazione del partecipante all\'azienda');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-40">
          <p>Caricamento dettagli azienda...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-10 border rounded-lg border-dashed">
          <p className="text-gray-500">Azienda non trovata</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/aziende')}>
            Torna alle aziende
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/aziende')} 
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Torna alle aziende
        </Button>
        <h1 className="text-2xl font-bold flex-1">Dettaglio Azienda</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleEditCompany}
          >
            <Edit className="h-4 w-4 mr-1" /> Modifica
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteCompany}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Elimina
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            {company.ragioneSociale}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>Partita IVA:</strong> {company.partitaIva}</p>
            <p><strong>Indirizzo:</strong> {company.indirizzo || 'Non specificato'}</p>
            <p><strong>Comune:</strong> {company.comune || 'Non specificato'}</p>
            <p><strong>CAP:</strong> {company.cap || 'Non specificato'}</p>
            <p><strong>Provincia:</strong> {company.provincia || 'Non specificato'}</p>
          </div>
          <div>
            <p><strong>Telefono:</strong> {company.telefono || 'Non specificato'}</p>
            <p><strong>Email:</strong> {company.email || 'Non specificato'}</p>
            <p><strong>Referente:</strong> {company.referente || 'Non specificato'}</p>
            <p><strong>Codice ATECO:</strong> {company.codiceAteco || 'Non specificato'}</p>
            <p><strong>Macrosettore:</strong> {company.macrosettore || 'Non specificato'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold flex-1">
            <Users className="inline mr-2 h-5 w-5" />
            Dipendenti dell'Azienda
          </h2>
          <Button 
            variant="outline" 
            onClick={handleAddParticipant}
            className="flex items-center"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Aggiungi Dipendente
          </Button>
          <div className="text-sm text-gray-500 ml-4">
            Totale: {participants.length}
          </div>
        </div>

        {participants.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cognome</TableHead>
                    <TableHead>Codice Fiscale</TableHead>
                    <TableHead>Qualifica</TableHead>
                    <TableHead>Anno Assunzione</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>{participant.nome}</TableCell>
                      <TableCell>{participant.cognome}</TableCell>
                      <TableCell>{participant.codicefiscale || 'Non specificato'}</TableCell>
                      <TableCell>{participant.qualifica || 'Non specificata'}</TableCell>
                      <TableCell>{participant.annoassunzione || 'Non specificato'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center p-8 border rounded-lg border-dashed">
            <Users className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">Nessun dipendente trovato per questa azienda</p>
          </div>
        )}
      </div>

      {/* Form di modifica azienda */}
      {company && (
        <CompanyFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          initialData={company}
          isEditing={true}
          onCompanyAdded={handleCompanyUpdated}
        />
      )}

      {/* Dialogo di ricerca partecipanti */}
      {company && (
        <CompanyParticipantSearchDialog
          isOpen={isParticipantSearchDialogOpen}
          onClose={() => setIsParticipantSearchDialogOpen(false)}
          onSelectParticipant={handleAssociateParticipant}
          companyId={company.id}
        />
      )}

      {/* Dialogo di conferma eliminazione */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questa azienda?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. L'azienda sarà rimossa permanentemente dal sistema.
              <div className="mt-2 p-3 bg-gray-100 rounded-md dark:bg-gray-800">
                <p><strong>Ragione Sociale:</strong> {company.ragioneSociale}</p>
                <p><strong>Partita IVA:</strong> {company.partitaIva}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={confirmDeleteCompany}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DettaglioAzienda;

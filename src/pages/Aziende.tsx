
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building, Edit, Trash2 } from 'lucide-react';
import CompanyFormDialog from '@/components/dialogs/CompanyFormDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';

// Make sure this interface matches CompanyFormValues in CompanyFormDialog.tsx
interface Company {
  id: string;
  ragioneSociale: string;
  partitaIva: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
  telefono: string;
  email: string;
  referente: string;
  codiceAteco: string;
  macrosettore?: string;
}

const Aziende: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('ragionesociale', { ascending: true });
      
      if (error) {
        console.error('Error loading companies:', error);
        toast.error('Errore nel caricamento delle aziende');
        return;
      }
      
      // Transform the data to match our Company interface
      const transformedData: Company[] = (data || []).map(item => ({
        id: item.id,
        ragioneSociale: item.ragionesociale,
        partitaIva: item.partitaiva,
        indirizzo: item.indirizzo || '',
        comune: item.comune || '',
        cap: item.cap || '',
        provincia: item.provincia || '',
        telefono: item.telefono || '',
        email: item.email || '',
        referente: item.referente || '',
        codiceAteco: item.codiceateco || '',
        macrosettore: item.macrosettore
      }));
      
      setCompanies(transformedData);
    } catch (error) {
      console.error('Error in loadCompanies:', error);
      toast.error('Errore nel caricamento delle aziende');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCompanyForm = () => {
    setIsCompanyFormOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    navigate(`/aziende/${company.id}`);
  };

  const handleEditCompany = (e: React.MouseEvent, company: Company) => {
    e.stopPropagation();
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCompany = (e: React.MouseEvent, company: Company) => {
    e.stopPropagation();
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!selectedCompany) return;
    
    try {
      // First check if there are any participants associated with this company
      const { data: associatedParticipants, error: checkError } = await supabase
        .from('participants')
        .select('id')
        .eq('aziendaid', selectedCompany.id);
      
      if (checkError) {
        console.error('Error checking associated participants:', checkError);
        toast.error('Errore durante la verifica delle associazioni');
        return;
      }
      
      if (associatedParticipants && associatedParticipants.length > 0) {
        toast.error(`Non puoi eliminare questa azienda perché ha ${associatedParticipants.length} dipendenti associati. Rimuovi prima tutte le associazioni.`);
        setIsDeleteDialogOpen(false);
        return;
      }
      
      // If no associations, proceed with deletion
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', selectedCompany.id);
      
      if (error) {
        console.error('Error deleting company:', error);
        toast.error('Errore durante l\'eliminazione dell\'azienda');
        return;
      }
      
      setCompanies(companies.filter((c) => c.id !== selectedCompany.id));
      toast.success('Azienda eliminata con successo');
    } catch (error) {
      console.error('Error in confirmDeleteCompany:', error);
      toast.error('Errore durante l\'eliminazione dell\'azienda');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    }
  };

  const handleCompanyUpdated = (updatedCompany: Company) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => 
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
    loadCompanies(); // Refresh companies to get the latest data
    toast.success('Azienda aggiornata con successo');
  };

  const handleCompanyAdded = (newCompany: Company) => {
    loadCompanies(); // Reload companies from the database instead of just adding to state
    toast.success('Azienda aggiunta con successo');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aziende</h1>
        <Button onClick={handleOpenCompanyForm}>
          <Plus className="mr-2 h-4 w-4" /> Aggiungi Azienda
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Caricamento aziende...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center p-10 border rounded-lg border-dashed">
          <Building className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">Nessuna azienda trovata</p>
          <Button variant="outline" className="mt-4" onClick={handleOpenCompanyForm}>
            <Plus className="mr-2 h-4 w-4" /> Aggiungi la prima azienda
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Card 
              key={company.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleViewCompany(company)}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  {company.ragioneSociale}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>P. IVA:</strong> {company.partitaIva}</p>
                <p><strong>Comune:</strong> {company.comune}</p>
                <p><strong>Referente:</strong> {company.referente || 'Non specificato'}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => handleEditCompany(e, company)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Modifica
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={(e) => handleDeleteCompany(e, company)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Elimina
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogo di conferma eliminazione */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questa azienda?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. L'azienda sarà rimossa permanentemente dal sistema.
              {selectedCompany && (
                <div className="mt-2 p-3 bg-gray-100 rounded-md dark:bg-gray-800">
                  <p><strong>Ragione Sociale:</strong> {selectedCompany.ragioneSociale}</p>
                  <p><strong>Partita IVA:</strong> {selectedCompany.partitaIva}</p>
                </div>
              )}
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

      {/* Form di aggiunta azienda */}
      <CompanyFormDialog
        isOpen={isCompanyFormOpen}
        onClose={() => setIsCompanyFormOpen(false)}
        onCompanyAdded={handleCompanyAdded}
      />

      {/* Form di modifica azienda */}
      {selectedCompany && (
        <CompanyFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedCompany(null);
          }}
          initialData={selectedCompany}
          isEditing={true}
          onCompanyAdded={handleCompanyUpdated}
        />
      )}
    </div>
  );
};

export default Aziende;

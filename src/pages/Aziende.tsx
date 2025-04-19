
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Building, Edit, Trash2 } from "lucide-react";
import CompanyFormDialog from '@/components/dialogs/CompanyFormDialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
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
}

const Aziende = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  // Load companies from localStorage
  useEffect(() => {
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, []);

  const handleAddCompany = () => {
    setIsAddingCompany(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsEditingCompany(true);
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanyToDelete(companyId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!companyToDelete) return;

    // Check if company is used by any participant
    const courses = localStorage.getItem('courses') 
      ? JSON.parse(localStorage.getItem('courses')!) 
      : [];
    
    let isCompanyInUse = false;
    
    for (const course of courses) {
      if (course.partecipantiList) {
        for (const participant of course.partecipantiList) {
          if (participant.aziendaId === companyToDelete) {
            isCompanyInUse = true;
            break;
          }
        }
      }
      if (isCompanyInUse) break;
    }

    if (isCompanyInUse) {
      toast.error("Non è possibile eliminare l'azienda perché è associata a uno o più partecipanti");
      setIsDeleteDialogOpen(false);
      return;
    }

    // Delete company
    const updatedCompanies = companies.filter(company => company.id !== companyToDelete);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);
    toast.success("Azienda eliminata con successo");
    setIsDeleteDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsAddingCompany(false);
    setIsEditingCompany(false);
    // Refresh companies list
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  };

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.ragioneSociale.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.partitaIva.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.comune.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.codiceAteco.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
            Gestione Aziende
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Archivio delle aziende registrate nel sistema
          </p>
        </div>
        <Button onClick={handleAddCompany}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuova Azienda
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Elenco Aziende</CardTitle>
            <CardDescription>
              {companies.length} aziende registrate nel sistema
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca azienda..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Azienda
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Partita IVA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Località
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Codice ATECO
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <tr key={company.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-slate-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                              {company.ragioneSociale}
                            </div>
                            <div className="text-sm text-slate-500">
                              {company.telefono} • {company.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                        {company.partitaIva}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                        {company.comune} ({company.provincia})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">
                        {company.codiceAteco}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Azioni
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifica
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCompany(company.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Elimina
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
                      {searchQuery ? "Nessuna azienda trovata con questi criteri di ricerca" : "Nessuna azienda registrata"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Company Form Dialogs */}
      <CompanyFormDialog
        isOpen={isAddingCompany}
        onClose={handleCloseDialog}
      />

      <CompanyFormDialog
        isOpen={isEditingCompany}
        onClose={handleCloseDialog}
        initialData={selectedCompany || {}}
        isEditing={true}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questa azienda? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Aziende;

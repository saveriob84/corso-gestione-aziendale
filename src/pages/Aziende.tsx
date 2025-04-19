
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building } from 'lucide-react';
import CompanyFormDialog from '@/components/dialogs/CompanyFormDialog';
import { toast } from 'sonner';

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
}

const Aziende: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, []);

  const handleOpenCompanyForm = () => {
    setIsCompanyFormOpen(true);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  const findEmployeesForCompany = (companyId: string) => {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const employeesInCompany: any[] = [];

    courses.forEach((course: any) => {
      const courseEmployees = course.partecipantiList?.filter(
        (participant: any) => participant.aziendaId === companyId
      ) || [];

      employeesInCompany.push(...courseEmployees);
    });

    return employeesInCompany;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aziende</h1>
        <Button onClick={handleOpenCompanyForm}>
          <Plus className="mr-2 h-4 w-4" /> Aggiungi Azienda
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <Card 
            key={company.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCompanySelect(company)}
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
          </Card>
        ))}
      </div>

      {selectedCompany && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Dettagli Azienda: {selectedCompany.ragioneSociale}
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Partita IVA:</strong> {selectedCompany.partitaIva}</p>
                  <p><strong>Indirizzo:</strong> {selectedCompany.indirizzo}</p>
                  <p><strong>Comune:</strong> {selectedCompany.comune}</p>
                  <p><strong>CAP:</strong> {selectedCompany.cap}</p>
                  <p><strong>Provincia:</strong> {selectedCompany.provincia}</p>
                </div>
                <div>
                  <p><strong>Telefono:</strong> {selectedCompany.telefono}</p>
                  <p><strong>Email:</strong> {selectedCompany.email}</p>
                  <p><strong>Referente:</strong> {selectedCompany.referente || 'Non specificato'}</p>
                  <p><strong>Codice ATECO:</strong> {selectedCompany.codiceAteco}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold mt-6 mb-4">
            Dipendenti dell'Azienda
          </h3>
          {findEmployeesForCompany(selectedCompany.id).length > 0 ? (
            <div className="space-y-2">
              {findEmployeesForCompany(selectedCompany.id).map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p><strong>Nome:</strong> {employee.nome} {employee.cognome}</p>
                        <p><strong>Qualifica:</strong> {employee.qualifica}</p>
                      </div>
                      <div>
                        <p><strong>Anno Assunzione:</strong> {employee.annoAssunzione}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nessun dipendente trovato per questa azienda.</p>
          )}
        </div>
      )}

      <CompanyFormDialog
        isOpen={isCompanyFormOpen}
        onClose={() => setIsCompanyFormOpen(false)}
        onCompanyAdded={(newCompany: Company) => {
          const updatedCompanies = [...companies, newCompany];
          setCompanies(updatedCompanies);
          localStorage.setItem('companies', JSON.stringify(updatedCompanies));
          toast.success('Azienda aggiunta con successo');
        }}
      />
    </div>
  );
};

export default Aziende;

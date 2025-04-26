
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { ImportInstructions } from "@/components/alerts/ImportInstructions";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ParticipantFormDialog from "@/components/dialogs/ParticipantFormDialog";
import ParticipantHeader from "@/components/participants/ParticipantHeader";
import ParticipantTable from "@/components/participants/ParticipantTable";
import { useParticipants } from "@/hooks/useParticipants";
import { getParticipantTemplate } from '@/utils/excelTemplates';
import { findOrCreateCompany } from '@/utils/companyUtils';
import { Participant, ParticipantFormValues } from '@/types/participant';
import { parseDateIfNeeded, formatDateForStorage } from '@/utils/dateUtils';

const Partecipanti = () => {
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Partial<ParticipantFormValues> | null>(null);
  const { 
    participants, 
    isLoading, 
    setIsLoading, 
    loadParticipants,
    deleteParticipant,
    searchQuery,
    setSearchQuery
  } = useParticipants();
  const { user } = useAuth();

  const handleEdit = (participant: Participant) => {
    // Convert the participant object to match ParticipantFormValues
    // The key step here is to convert the datanascita string to a Date object
    const formattedParticipant: Partial<ParticipantFormValues> = {
      ...participant,
      datanascita: parseDateIfNeeded(participant.datanascita)
    };
    
    setEditingParticipant(formattedParticipant);
    setIsAddingParticipant(true);
  };

  const handleDelete = async (id: string) => {
    await deleteParticipant(id);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error('Devi effettuare l\'accesso per importare i partecipanti');
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(firstSheet);

        const importResults = {
          success: 0,
          errors: 0,
          companiesCreated: 0,
          companiesLinked: 0,
          errorDetails: [] as string[]
        };

        for (const row of rows) {
          try {
            if (!row['Nome*'] || !row['Cognome*']) {
              importResults.errorDetails.push(`Riga mancante di Nome o Cognome obbligatori`);
              importResults.errors++;
              continue;
            }

            const companyData = {
              ragioneSociale: row['Ragione Sociale Azienda*'] || row['Ragione Sociale Azienda'] || '',
              partitaIva: row['Partita IVA Azienda'] || '',
              indirizzo: row['Indirizzo Azienda'] || '',
              comune: row['Comune Azienda'] || '',
              cap: row['CAP Azienda'] || '',
              provincia: row['Provincia Azienda'] || '',
              telefono: row['Telefono Azienda'] || '',
              email: row['Email Azienda'] || '',
              referente: row['Referente Azienda'] || '',
              codiceAteco: row['Codice ATECO'] || ''
            };

            let aziendaId: string | undefined;
            let aziendaNome: string | undefined;

            if (companyData.ragioneSociale) {
              aziendaId = await findOrCreateCompany(companyData);
              if (aziendaId) {
                aziendaNome = companyData.ragioneSociale;
                importResults.companiesLinked++;
              }
            }

            // Parse and format the birth date correctly for storage
            let birthDate = null;
            if (row['Data di Nascita (GG/MM/AAAA)'] || row['Data di Nascita']) {
              const rawDate = row['Data di Nascita (GG/MM/AAAA)'] || row['Data di Nascita'];
              const parsedDate = parseDateIfNeeded(rawDate);
              birthDate = parsedDate ? formatDateForStorage(parsedDate) : null;
            }

            const participantData = {
              nome: row['Nome*'] || row['Nome'],
              cognome: row['Cognome*'] || row['Cognome'],
              codicefiscale: (row['Codice Fiscale*'] || row['Codice Fiscale'] || '').toUpperCase(),
              luogonascita: row['Luogo di Nascita'] || '',
              datanascita: birthDate,
              username: row['Username'] || '',
              password: row['Password'] || '',
              numerocellulare: row['Numero di cellulare'] || '',
              aziendaid: aziendaId,
              azienda: aziendaNome,
              titolostudio: row['Titolo di Studio'] || '',
              ccnl: row['CCNL'] || '',
              contratto: row['Tipologia contrattuale'] || '',
              qualifica: row['Qualifica professionale'] || '',
              annoassunzione: row['Anno di assunzione'] || '',
              user_id: user.id
            };

            const { error: participantError } = await supabase
              .from('participants')
              .insert([participantData]);

            if (participantError) {
              console.error('Error inserting participant:', participantError);
              importResults.errorDetails.push(
                `Errore inserendo ${participantData.nome} ${participantData.cognome}: ${participantError.message}`
              );
              importResults.errors++;
            } else {
              importResults.success++;
            }
          } catch (error: any) {
            console.error('Error processing row:', error);
            importResults.errorDetails.push(`Errore generico: ${error.message}`);
            importResults.errors++;
          }
        }

        if (importResults.success > 0) {
          toast.success(`Importati ${importResults.success} partecipanti con successo`);
          if (importResults.companiesLinked > 0) {
            toast.success(`Collegate ${importResults.companiesLinked} aziende ai partecipanti`);
          }
        }
        
        if (importResults.errors > 0) {
          toast.error(`Si sono verificati ${importResults.errors} errori durante l'importazione`);
          importResults.errorDetails.forEach(error => {
            toast.error(error);
          });
        }

        await loadParticipants();
      } catch (error: any) {
        console.error('Error importing file:', error);
        toast.error(`Errore durante l'importazione del file: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    try {
      const template = getParticipantTemplate();
      const worksheet = XLSX.utils.json_to_sheet(template);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      XLSX.writeFile(workbook, 'template-partecipanti.xlsx');
      
      toast.success('Template scaricato con successo');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Errore durante il download del template');
    }
  };

  const handleExport = () => {
    try {
      const dataToExport = participants.map(p => ({
        'Nome': p.nome,
        'Cognome': p.cognome,
        'Codice Fiscale': p.codicefiscale,
        'Data di Nascita': p.datanascita || '',
        'Azienda': p.azienda || '',
        'Titolo di Studio': p.titolostudio || '',
        'Qualifica': p.qualifica || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Partecipanti');
      XLSX.writeFile(workbook, 'elenco-partecipanti.xlsx');
      
      toast.success('Esportazione completata con successo');
    } catch (error) {
      console.error('Error exporting file:', error);
      toast.error('Errore durante l\'esportazione');
    }
  };

  const triggerImportInput = () => {
    document.getElementById('import-file')?.click();
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <ParticipantHeader
        isLoading={isLoading}
        onDownloadTemplate={downloadTemplate}
        onImportClick={triggerImportInput}
        onAddParticipant={() => {
          setEditingParticipant(null);
          setIsAddingParticipant(true);
        }}
        onExport={handleExport}
      />

      <ImportInstructions />

      <input
        type="file"
        id="import-file"
        className="hidden"
        accept=".xlsx,.xls,.csv"
        onChange={handleImport}
        disabled={isLoading}
      />

      <Card>
        <CardContent>
          <ParticipantTable 
            participants={participants}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </CardContent>
      </Card>

      <ParticipantFormDialog
        isOpen={isAddingParticipant}
        onClose={() => {
          setIsAddingParticipant(false);
          setEditingParticipant(null);
        }}
        initialData={editingParticipant || undefined}
        isEditing={!!editingParticipant}
        onSuccess={loadParticipants}
      />
    </div>
  );
};

export default Partecipanti;

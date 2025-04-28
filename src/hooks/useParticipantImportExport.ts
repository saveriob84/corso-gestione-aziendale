
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { findOrCreateCompany } from '@/utils/companyUtils';
import { parseDateIfNeeded, formatDateForStorage } from '@/utils/dateUtils';
import { getParticipantTemplate } from '@/utils/excelTemplates';

export const useParticipantImportExport = (loadParticipants: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>, userId: string | undefined) => {
    if (!userId) {
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
          dateErrors: 0,
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

            // Parse and validate birth date
            let birthDate = null;
            const rawDate = row['Data di Nascita (GG/MM/AAAA)*'] || row['Data di Nascita'];
            if (rawDate) {
              console.log(`Attempting to parse date: ${rawDate}`);
              const parsedDate = parseDateIfNeeded(rawDate);
              if (parsedDate) {
                birthDate = formatDateForStorage(parsedDate);
                console.log(`Parsed and formatted date: ${birthDate}`);
              } else {
                importResults.dateErrors++;
                importResults.errorDetails.push(
                  `Errore nel formato della data di nascita per ${row['Nome*']} ${row['Cognome*']}: ${rawDate}`
                );
                continue;
              }
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
              user_id: userId
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

        // Show import results
        if (importResults.success > 0) {
          toast.success(`Importati ${importResults.success} partecipanti con successo`);
        }
        
        if (importResults.dateErrors > 0) {
          toast.error(`${importResults.dateErrors} partecipanti hanno date di nascita non valide`);
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

  const handleExport = (participants: any[]) => {
    try {
      const dataToExport = participants.map(p => ({
        'Nome': p.nome,
        'Cognome': p.cognome,
        'Codice Fiscale': p.codicefiscale || '',
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

  return {
    isLoading,
    setIsLoading,
    handleImport,
    downloadTemplate,
    handleExport
  };
};

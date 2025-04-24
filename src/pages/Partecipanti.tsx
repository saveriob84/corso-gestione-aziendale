import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Download, Upload, FileText, UserPlus } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getParticipantTemplate } from '@/utils/excelTemplates';
import { ImportInstructions } from "@/components/alerts/ImportInstructions";
import { format, isValid, parse } from "date-fns";
import { it } from "date-fns/locale";
import { supabase } from '@/integrations/supabase/client';
import ParticipantFormDialog from "@/components/dialogs/ParticipantFormDialog";
import { DatabaseParticipant, Participant } from '@/types/participant';

const Partecipanti = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*');
      
      if (error) {
        console.error('Error loading participants:', error);
        toast.error('Errore nel caricamento dei partecipanti');
        return;
      }

      console.log('Loaded participants:', data);
      
      const transformedData: Participant[] = (data || []).map((dbParticipant: DatabaseParticipant) => ({
        id: dbParticipant.id,
        nome: dbParticipant.nome,
        cognome: dbParticipant.cognome,
        codicefiscale: dbParticipant.codicefiscale || '-',
        luogonascita: dbParticipant.luogonascita,
        datanascita: dbParticipant.datanascita,
        aziendaId: dbParticipant.aziendaid,
        azienda: dbParticipant.azienda,
        titolostudio: dbParticipant.titolostudio,
        qualifica: dbParticipant.qualifica,
        username: dbParticipant.username,
        numerocellulare: dbParticipant.numerocellulare,
        annoassunzione: dbParticipant.annoassunzione
      }));
      
      setParticipants(transformedData);
    } catch (error) {
      console.error('Error in loadParticipants:', error);
      toast.error('Errore nel caricamento dei partecipanti');
    }
  };

  const findOrCreateCompany = async (companyData: any) => {
    if (!companyData.ragioneSociale) return undefined;

    try {
      const { data: existingCompanies, error: searchError } = await supabase
        .from('companies')
        .select('*')
        .eq('ragionesociale', companyData.ragioneSociale)
        .maybeSingle();

      if (searchError) {
        console.error('Error searching for company:', searchError);
        return undefined;
      }

      if (existingCompanies) {
        return existingCompanies.id;
      }

      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert([{
          ragionesociale: companyData.ragioneSociale,
          partitaiva: companyData.partitaIva || '',
          indirizzo: companyData.indirizzo || '',
          comune: companyData.comune || '',
          cap: companyData.cap || '',
          provincia: companyData.provincia || '',
          telefono: companyData.telefono || '',
          email: companyData.email || '',
          referente: companyData.referente || '',
          codiceateco: companyData.codiceAteco || ''
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating company:', insertError);
        return undefined;
      }

      return newCompany.id;
    } catch (error) {
      console.error('Error in findOrCreateCompany:', error);
      return undefined;
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
              try {
                aziendaId = await findOrCreateCompany(companyData);
                if (aziendaId) {
                  aziendaNome = companyData.ragioneSociale;
                  importResults.companiesLinked++;
                }
              } catch (error: any) {
                console.error('Error with company:', error);
                importResults.errorDetails.push(
                  `Errore con l'azienda "${companyData.ragioneSociale}": ${error.message}`
                );
                importResults.errors++;
                continue;
              }
            }

            const participantData = {
              nome: row['Nome*'] || row['Nome'],
              cognome: row['Cognome*'] || row['Cognome'],
              codicefiscale: (row['Codice Fiscale*'] || row['Codice Fiscale'] || '').toUpperCase(),
              luogoNascita: row['Luogo di Nascita'] || '',
              dataNascita: row['Data di Nascita (GG/MM/AAAA)'] || row['Data di Nascita'] || '',
              aziendaid: aziendaId,
              azienda: aziendaNome,
              titoloStudio: row['Titolo di Studio'] || '',
              qualifica: row['Qualifica professionale'] || '',
              annoassunzione: row['Anno di assunzione'] || ''
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

  const formatDateOfBirth = (dateString?: string): string => {
    if (!dateString) return '-';

    if (/^\d+$/.test(dateString)) {
      const date = new Date(1899, 11, 30);
      date.setDate(date.getDate() + parseInt(dateString));
      if (isValid(date) && date.getFullYear() > 1920 && date.getFullYear() < new Date().getFullYear()) {
        return format(date, 'dd/MM/yyyy', { locale: it });
      }
    }

    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, 'dd/MM/yyyy', { locale: it });
    }

    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'yyyy/MM/dd'];
    for (const formatString of formats) {
      const parsedDate = parse(dateString, formatString, new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'dd/MM/yyyy', { locale: it });
      }
    }

    return dateString;
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

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Elenco Partecipanti</h1>
          <p className="text-muted-foreground">Gestione partecipanti ai corsi</p>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default"
                onClick={() => setIsAddingParticipant(true)}
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nuovo Partecipante
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              Aggiungi un nuovo partecipante
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={downloadTemplate} disabled={isLoading}>
                <FileText className="mr-2 h-4 w-4" />
                Scarica Template Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              Scarica un template Excel con tutti i campi necessari per importare i partecipanti
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('import-file')?.click()}
                disabled={isLoading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? 'Importazione in corso...' : 'Importa Excel/CSV'}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              Importa un file Excel o CSV contenente l'elenco dei partecipanti
            </TooltipContent>
          </Tooltip>
          
          <input
            type="file"
            id="import-file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
            disabled={isLoading}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleExport} disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                Esporta Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              Esporta l'elenco completo dei partecipanti in formato Excel
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <ImportInstructions />

      <Card>
        <CardHeader>
          <CardTitle>Partecipanti</CardTitle>
          <CardDescription>Lista completa dei partecipanti a tutti i corsi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cognome</TableHead>
                <TableHead>Codice Fiscale</TableHead>
                <TableHead>Data di Nascita</TableHead>
                <TableHead>Azienda</TableHead>
                <TableHead>Titolo di Studio</TableHead>
                <TableHead>Qualifica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.nome}</TableCell>
                  <TableCell>{participant.cognome}</TableCell>
                  <TableCell>{participant.codicefiscale}</TableCell>
                  <TableCell>{formatDateOfBirth(participant.datanascita)}</TableCell>
                  <TableCell>{participant.azienda || '-'}</TableCell>
                  <TableCell>{participant.titolostudio || '-'}</TableCell>
                  <TableCell>{participant.qualifica || '-'}</TableCell>
                </TableRow>
              ))}
              {participants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {isLoading ? 'Caricamento...' : 'Nessun partecipante trovato'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ParticipantFormDialog
        isOpen={isAddingParticipant}
        onClose={() => setIsAddingParticipant(false)}
      />
    </div>
  );
};

export default Partecipanti;

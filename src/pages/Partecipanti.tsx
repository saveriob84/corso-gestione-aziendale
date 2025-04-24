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

  useEffect(() => {
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
        
        // Transform the data to match our Participant interface
        const transformedData: Participant[] = (data || []).map((dbParticipant: DatabaseParticipant) => ({
          id: dbParticipant.id,
          nome: dbParticipant.nome,
          cognome: dbParticipant.cognome,
          codiceFiscale: dbParticipant.codiceFiscale || '-', // Provide default values for required fields
          luogoNascita: dbParticipant.luogoNascita,
          dataNascita: dbParticipant.dataNascita,
          aziendaId: dbParticipant.aziendaid,
          azienda: dbParticipant.azienda,
          titoloStudio: dbParticipant.titoloStudio,
          qualifica: dbParticipant.qualifica,
          username: dbParticipant.username,
          numeroCellulare: dbParticipant.numeroCellulare,
          annoAssunzione: dbParticipant.annoassunzione
        }));
        
        setParticipants(transformedData);
      } catch (error) {
        console.error('Error in loadParticipants:', error);
        toast.error('Errore nel caricamento dei partecipanti');
      }
    };

    loadParticipants();
  }, []);

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

  const findOrCreateCompany = (companyData: any): string | undefined => {
    if (!companyData.ragioneSociale) return undefined;

    const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    const existingCompany = existingCompanies.find((company: any) => 
      (company.ragioneSociale.toLowerCase() === companyData.ragioneSociale.toLowerCase()) || 
      (companyData.partitaIva && company.partitaIva && company.partitaIva === companyData.partitaIva)
    );

    if (existingCompany) {
      return existingCompany.id;
    }

    const newCompany: any = {
      id: crypto.randomUUID(),
      ragioneSociale: companyData.ragioneSociale,
      partitaIva: companyData.partitaIva || '',
      indirizzo: companyData.indirizzo || '',
      comune: companyData.comune || '',
      cap: companyData.cap || '',
      provincia: companyData.provincia || '',
      telefono: companyData.telefono || '',
      email: companyData.email || '',
      referente: companyData.referente || '',
      codiceAteco: companyData.codiceAteco || '',
      macrosettore: companyData.macrosettore || ''
    };

    const updatedCompanies = [...existingCompanies, newCompany];
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    
    return newCompany.id;
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(firstSheet);

        const newParticipants: Participant[] = [];
        const newCompaniesCreated: string[] = [];
        const existingCompaniesLinked: string[] = [];

        rows.forEach(row => {
          if (!row['Nome*'] || !row['Cognome*'] || !row['Codice Fiscale*']) {
            throw new Error('Campi obbligatori mancanti: Nome, Cognome e Codice Fiscale sono richiesti');
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
            codiceAteco: row['Codice ATECO'] || '',
            macrosettore: row['Macrosettore'] || ''
          };

          let aziendaId: string | undefined;
          let aziendaNome: string | undefined;
          
          const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
          if (companyData.ragioneSociale) {
            const existingCompany = existingCompanies.find((company: any) => 
              (company.ragioneSociale.toLowerCase() === companyData.ragioneSociale.toLowerCase()) || 
              (companyData.partitaIva && company.partitaIva && company.partitaIva === companyData.partitaIva)
            );

            if (existingCompany) {
              aziendaId = existingCompany.id;
              aziendaNome = existingCompany.ragioneSociale;
              
              if (!existingCompaniesLinked.includes(existingCompany.ragioneSociale)) {
                existingCompaniesLinked.push(existingCompany.ragioneSociale);
              }
            } else {
              const newCompany: any = {
                id: crypto.randomUUID(),
                ragioneSociale: companyData.ragioneSociale,
                partitaIva: companyData.partitaIva || '',
                indirizzo: companyData.indirizzo || '',
                comune: companyData.comune || '',
                cap: companyData.cap || '',
                provincia: companyData.provincia || '',
                telefono: companyData.telefono || '',
                email: companyData.email || '',
                referente: companyData.referente || '',
                codiceAteco: companyData.codiceAteco || '',
                macrosettore: companyData.macrosettore || ''
              };

              existingCompanies.push(newCompany);
              
              aziendaId = newCompany.id;
              aziendaNome = newCompany.ragioneSociale;
              
              if (!newCompaniesCreated.includes(newCompany.ragioneSociale)) {
                newCompaniesCreated.push(newCompany.ragioneSociale);
              }
            }
            
            localStorage.setItem('companies', JSON.stringify(existingCompanies));
          }

          const participant: Participant = {
            id: crypto.randomUUID(),
            nome: row['Nome*'] || row['Nome'] || '',
            cognome: row['Cognome*'] || row['Cognome'] || '',
            codiceFiscale: (row['Codice Fiscale*'] || row['Codice Fiscale'] || '').toUpperCase(),
            luogoNascita: row['Luogo di Nascita'] || '',
            dataNascita: row['Data di Nascita (GG/MM/AAAA)'] || row['Data di Nascita'] || '',
            aziendaId: aziendaId,
            azienda: aziendaNome,
            titoloStudio: row['Titolo di Studio'] || '',
            username: row['Username'] || '',
            password: row['Password'] || '',
            numeroCellulare: row['Numero di cellulare'] || '',
            ccnl: row['CCNL'] || '',
            tipologiaContrattuale: row['Tipologia contrattuale'] || '',
            qualifica: row['Qualifica professionale'] || '',
            annoAssunzione: row['Anno di assunzione'] || ''
          };

          newParticipants.push(participant);
        });

        const updatedParticipants = [...participants, ...newParticipants];
        localStorage.setItem('participants', JSON.stringify(updatedParticipants));
        setParticipants(updatedParticipants);
        
        toast.success(`Importati ${newParticipants.length} partecipanti con successo`);
        
        if (newCompaniesCreated.length > 0) {
          toast.success(`Create ${newCompaniesCreated.length} nuove aziende: ${newCompaniesCreated.join(', ')}`);
        }
        
        if (existingCompaniesLinked.length > 0) {
          toast.success(`Collegate ${existingCompaniesLinked.length} aziende esistenti ai partecipanti`);
        }
        
      } catch (error) {
        console.error('Error importing file:', error);
        toast.error(error instanceof Error ? error.message : 'Errore durante l\'importazione del file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    try {
      const dataToExport = participants.map(p => ({
        'Nome': p.nome,
        'Cognome': p.cognome,
        'Codice Fiscale': p.codiceFiscale,
        'Data di Nascita': p.dataNascita || '',
        'Azienda': p.azienda || '',
        'Titolo di Studio': p.titoloStudio || '',
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
              <Button variant="outline" onClick={downloadTemplate}>
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
              <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Importa Excel/CSV
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
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleExport}>
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
                  <TableCell>{participant.codiceFiscale}</TableCell>
                  <TableCell>{formatDateOfBirth(participant.dataNascita)}</TableCell>
                  <TableCell>{participant.azienda || '-'}</TableCell>
                  <TableCell>{participant.titoloStudio || '-'}</TableCell>
                  <TableCell>{participant.qualifica || '-'}</TableCell>
                </TableRow>
              ))}
              {participants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nessun partecipante trovato
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

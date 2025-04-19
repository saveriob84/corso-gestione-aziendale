import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Download, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getParticipantTemplate } from '@/utils/excelTemplates';
import { ImportInstructions } from "@/components/alerts/ImportInstructions";
import { format, isValid, parse } from "date-fns";
import { it } from "date-fns/locale";

interface Participant {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  luogoNascita?: string;
  dataNascita?: string;
  aziendaId?: string;
  azienda?: string;
  titoloStudio?: string;
  qualifica?: string;
  username?: string;
  password?: string;
  numeroCellulare?: string;
  ccnl?: string;
  tipologiaContrattuale?: string;
  annoAssunzione?: string;
}

interface Company {
  id: string;
  ragioneSociale: string;
  partitaIva?: string;
  indirizzo?: string;
  comune?: string;
  cap?: string;
  provincia?: string;
  telefono?: string;
  email?: string;
  referente?: string;
  codiceAteco?: string;
  macrosettore?: string;
}

const Partecipanti = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const loadParticipants = () => {
      const savedParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
      setParticipants(savedParticipants);
    };

    loadParticipants();
  }, []);

  const formatDateOfBirth = (dateString?: string): string => {
    if (!dateString) return '-';

    // Check if it's a numeric value that needs formatting
    if (/^\d+$/.test(dateString)) {
      // Try to parse it as a day of the year (Excel sometimes stores dates this way)
      const date = new Date(1899, 11, 30);
      date.setDate(date.getDate() + parseInt(dateString));
      if (isValid(date) && date.getFullYear() > 1920 && date.getFullYear() < new Date().getFullYear()) {
        return format(date, 'dd/MM/yyyy', { locale: it });
      }
    }

    // Try to parse as DD/MM/YYYY format
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, 'dd/MM/yyyy', { locale: it });
    }

    // Try different formats if the standard one fails
    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'yyyy/MM/dd'];
    for (const formatString of formats) {
      const parsedDate = parse(dateString, formatString, new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'dd/MM/yyyy', { locale: it });
      }
    }

    // Return original string if we can't parse it
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
    // Se non c'è la ragione sociale, non creiamo l'azienda
    if (!companyData.ragioneSociale) return undefined;

    // Recuperare le aziende esistenti
    const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    // Cercare se l'azienda esiste già per ragione sociale o partita IVA
    const existingCompany = existingCompanies.find((company: Company) => 
      (company.ragioneSociale.toLowerCase() === companyData.ragioneSociale.toLowerCase()) || 
      (companyData.partitaIva && company.partitaIva && company.partitaIva === companyData.partitaIva)
    );

    if (existingCompany) {
      return existingCompany.id;
    }

    // Se non esiste, creare una nuova azienda
    const newCompany: Company = {
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

    // Salvare la nuova azienda
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

          // Estrazione dati azienda dal file Excel
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

          // Trova o crea azienda se ci sono dati validi
          let aziendaId: string | undefined;
          let aziendaNome: string | undefined;
          
          const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
          if (companyData.ragioneSociale) {
            // Cercare se l'azienda esiste già per ragione sociale o partita IVA
            const existingCompany = existingCompanies.find((company: Company) => 
              (company.ragioneSociale.toLowerCase() === companyData.ragioneSociale.toLowerCase()) || 
              (companyData.partitaIva && company.partitaIva && company.partitaIva === companyData.partitaIva)
            );

            if (existingCompany) {
              aziendaId = existingCompany.id;
              aziendaNome = existingCompany.ragioneSociale;
              
              // Aggiunta alla lista delle aziende collegate
              if (!existingCompaniesLinked.includes(existingCompany.ragioneSociale)) {
                existingCompaniesLinked.push(existingCompany.ragioneSociale);
              }
            } else {
              // Crea nuova azienda
              const newCompany: Company = {
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

              // Salvare la nuova azienda
              existingCompanies.push(newCompany);
              
              aziendaId = newCompany.id;
              aziendaNome = newCompany.ragioneSociale;
              
              // Aggiunta alla lista delle nuove aziende create
              if (!newCompaniesCreated.includes(newCompany.ragioneSociale)) {
                newCompaniesCreated.push(newCompany.ragioneSociale);
              }
            }
            
            // Salva le aziende aggiornate
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
        
        // Notifiche di successo
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
    </div>
  );
};

export default Partecipanti;

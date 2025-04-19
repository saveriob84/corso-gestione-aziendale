import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Download, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { info } from 'console';

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

const Partecipanti = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const loadAllParticipants = () => {
      const courses = JSON.parse(localStorage.getItem('courses') || '[]');
      const allParticipants: Participant[] = [];
      
      courses.forEach(course => {
        if (course.partecipantiList) {
          allParticipants.push(...course.partecipantiList);
        }
      });
      
      setParticipants(allParticipants);
    };

    loadAllParticipants();
  }, []);

  const downloadTemplate = () => {
    try {
      const template = [
        {
          'Nome*': '',
          'Cognome*': '',
          'Codice Fiscale*': '',
          'Data di Nascita (GG/MM/AAAA)': '',
          'Azienda': '',
          'Titolo di Studio': '',
          'Qualifica': ''
        }
      ];

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

        const mappedParticipants = rows.map(row => {
          const participant = {
            id: crypto.randomUUID(),
            nome: row['Nome*'] || row['Nome'] || '',
            cognome: row['Cognome*'] || row['Cognome'] || '',
            codiceFiscale: (row['Codice Fiscale*'] || row['Codice Fiscale'] || '').toUpperCase(),
            dataNascita: row['Data di Nascita (GG/MM/AAAA)'] || row['Data di Nascita'] || '',
            azienda: row['Azienda'] || '',
            titoloStudio: row['Titolo di Studio'] || '',
            qualifica: row['Qualifica'] || ''
          };

          if (!participant.nome || !participant.cognome || !participant.codiceFiscale) {
            throw new Error('Campi obbligatori mancanti: Nome, Cognome e Codice Fiscale sono richiesti');
          }

          return participant;
        });

        setParticipants(prev => [...prev, ...mappedParticipants]);
        toast.success(`Importati ${mappedParticipants.length} partecipanti con successo`);
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

      <Alert>
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Istruzioni per l'importazione:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Campi obbligatori:</strong> Nome, Cognome, Codice Fiscale</li>
              <li><strong>Formato data di nascita:</strong> GG/MM/AAAA</li>
              <li><strong>Codice Fiscale:</strong> verrà automaticamente convertito in maiuscolo</li>
              <li>Gli altri campi sono opzionali</li>
              <li>Scarica il template Excel per vedere il formato corretto dei dati</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

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
                  <TableCell>{participant.dataNascita || '-'}</TableCell>
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

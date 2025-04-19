
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { File, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

interface Participant {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale?: string;
  aziendaId?: string;
  azienda?: string;
  ruolo?: string;
}

const Partecipanti = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Load all participants from all courses
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

        // Map Excel columns to participant properties
        const mappedParticipants = rows.map(row => ({
          id: crypto.randomUUID(),
          nome: row.Nome || row.nome || '',
          cognome: row.Cognome || row.cognome || '',
          codiceFiscale: row['Codice Fiscale'] || row.codiceFiscale || '',
          azienda: row.Azienda || row.azienda || '',
          ruolo: row.Ruolo || row.ruolo || ''
        }));

        setParticipants(prev => [...prev, ...mappedParticipants]);
        toast.success(`Importati ${mappedParticipants.length} partecipanti con successo`);
      } catch (error) {
        console.error('Error importing file:', error);
        toast.error('Errore durante l\'importazione del file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(participants.map(p => ({
        'Nome': p.nome,
        'Cognome': p.cognome,
        'Codice Fiscale': p.codiceFiscale || '',
        'Azienda': p.azienda || '',
        'Ruolo': p.ruolo || ''
      })));

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
          <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Importa Excel/CSV
          </Button>
          <input
            type="file"
            id="import-file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
          />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Esporta Excel
          </Button>
        </div>
      </div>

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
                <TableHead>Azienda</TableHead>
                <TableHead>Ruolo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.nome}</TableCell>
                  <TableCell>{participant.cognome}</TableCell>
                  <TableCell>{participant.codiceFiscale || '-'}</TableCell>
                  <TableCell>{participant.azienda || '-'}</TableCell>
                  <TableCell>{participant.ruolo || '-'}</TableCell>
                </TableRow>
              ))}
              {participants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
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

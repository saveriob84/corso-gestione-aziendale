
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, Filter } from "lucide-react";

const ArchivioComunicazioni = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const comunicazioni = [
    { 
      id: 1, 
      protocollo: "PROT-2023-001", 
      tipologia: "Inizio corso", 
      corso: "Sicurezza sul Lavoro", 
      data: "2023-10-15", 
      destinatari: "Aziende partecipanti", 
      filename: "comunicazione_inizio_corso_sicurezza.pdf" 
    },
    { 
      id: 2, 
      protocollo: "PROT-2023-002", 
      tipologia: "Elenco partecipanti", 
      corso: "Sicurezza sul Lavoro", 
      data: "2023-10-16", 
      destinatari: "Ufficio formazione", 
      filename: "elenco_partecipanti_sicurezza.pdf" 
    },
    { 
      id: 3, 
      protocollo: "PROT-2023-003", 
      tipologia: "Fine corso", 
      corso: "Marketing Digitale", 
      data: "2023-09-30", 
      destinatari: "Aziende partecipanti", 
      filename: "comunicazione_fine_corso_marketing.pdf" 
    },
    { 
      id: 4, 
      protocollo: "PROT-2023-004", 
      tipologia: "Elenco docenti", 
      corso: "Leadership", 
      data: "2023-11-05", 
      destinatari: "Ufficio risorse umane", 
      filename: "elenco_docenti_leadership.pdf" 
    },
  ];

  // Filter comunicazioni based on search query
  const filteredComunicazioni = comunicazioni.filter(com => 
    com.protocollo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    com.tipologia.toLowerCase().includes(searchQuery.toLowerCase()) || 
    com.corso.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
            Archivio Comunicazioni
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestione e consultazione di tutte le comunicazioni generate
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ricerca Comunicazioni</CardTitle>
          <CardDescription>Filtra per protocollo, tipologia o corso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cerca comunicazioni..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtri avanzati
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Nuova comunicazione
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Elenco Comunicazioni</CardTitle>
          <CardDescription>
            {filteredComunicazioni.length} comunicazioni trovate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Protocollo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipologia</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Corso</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Destinatari</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                {filteredComunicazioni.map((comunicazione) => (
                  <tr key={comunicazione.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-50">{comunicazione.protocollo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{comunicazione.tipologia}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{comunicazione.corso}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{comunicazione.data}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{comunicazione.destinatari}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-1 h-4 w-4" />
                          Scarica
                        </Button>
                        <Button variant="ghost" size="sm">Visualizza</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creazione Protocolli</CardTitle>
          <CardDescription>Crea e assegna nuovi numeri di protocollo alle comunicazioni</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow space-y-2">
              <label htmlFor="protocollo" className="text-sm font-medium">Numero Protocollo</label>
              <Input id="protocollo" placeholder="Inserisci il numero di protocollo..." />
            </div>
            <div className="flex-grow space-y-2">
              <label htmlFor="documento" className="text-sm font-medium">Documento</label>
              <select id="documento" className="w-full h-10 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm">
                <option value="">Seleziona documento...</option>
                <option value="1">comunicazione_inizio_corso_sicurezza.pdf</option>
                <option value="2">elenco_partecipanti_sicurezza.pdf</option>
                <option value="3">comunicazione_fine_corso_marketing.pdf</option>
              </select>
            </div>
            <div className="flex-grow space-y-2">
              <label htmlFor="data" className="text-sm font-medium">Data</label>
              <Input id="data" type="date" />
            </div>
            <Button>
              Assegna protocollo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivioComunicazioni;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Search, FileText, Filter, Eye, Download, PenLine, Plus } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data per la tabella dei corsi
  const corsi = [
    {
      id: "1",
      codice: "FORM-001",
      titolo: "Sicurezza sul Lavoro",
      edizioni: 3,
      partecipanti: 28,
      docenti: 2,
      tutor: 1,
      aziende: 5,
      stato: "Completato"
    },
    {
      id: "2",
      codice: "FORM-002",
      titolo: "Marketing Digitale",
      edizioni: 1,
      partecipanti: 12,
      docenti: 1,
      tutor: 1,
      aziende: 3,
      stato: "In corso"
    },
    {
      id: "3",
      codice: "FORM-003",
      titolo: "Leadership e Team Management",
      edizioni: 2,
      partecipanti: 15,
      docenti: 2,
      tutor: 1,
      aziende: 4,
      stato: "Pianificato"
    },
    {
      id: "4",
      codice: "FORM-004",
      titolo: "Excel Avanzato",
      edizioni: 4,
      partecipanti: 30,
      docenti: 1,
      tutor: 2,
      aziende: 6,
      stato: "Completato"
    },
    {
      id: "5",
      codice: "FORM-005",
      titolo: "Tecniche di Vendita",
      edizioni: 2,
      partecipanti: 18,
      docenti: 1,
      tutor: 1,
      aziende: 3,
      stato: "In corso"
    }
  ];

  // Filtra i corsi in base alla ricerca
  const filteredCorsi = corsi.filter(corso =>
    corso.codice.toLowerCase().includes(searchQuery.toLowerCase()) ||
    corso.titolo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Funzione per determinare il colore del badge in base allo stato
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completato':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In corso':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Pianificato':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
            Dashboard Corsi
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestisci i corsi di formazione e visualizza il loro stato
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Corso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Corsi Attivi
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              +2 rispetto al mese scorso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Partecipanti Totali
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">103</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              +15 rispetto al mese scorso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aziende Partner
            </CardTitle>
            <LayoutDashboard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              +3 rispetto al mese scorso
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestione Corsi</CardTitle>
          <CardDescription>Lista completa dei corsi di formazione</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cerca corso per codice o titolo..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtri avanzati
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codice</TableHead>
                <TableHead>Titolo corso</TableHead>
                <TableHead>Edizioni</TableHead>
                <TableHead>Partecipanti</TableHead>
                <TableHead>Docenti</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Aziende</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCorsi.map((corso) => (
                <TableRow key={corso.id}>
                  <TableCell className="font-medium">{corso.codice}</TableCell>
                  <TableCell>{corso.titolo}</TableCell>
                  <TableCell>{corso.edizioni}</TableCell>
                  <TableCell>{corso.partecipanti}</TableCell>
                  <TableCell>{corso.docenti}</TableCell>
                  <TableCell>{corso.tutor}</TableCell>
                  <TableCell>{corso.aziende}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(corso.stato)}>
                      {corso.stato}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/corsi/${corso.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <PenLine className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

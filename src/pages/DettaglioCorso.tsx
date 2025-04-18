
import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, File, FileText, Users, BookOpen, PlusCircle, Download, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DettaglioCorso = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data - in un'applicazione reale questi dati verrebbero caricati da un'API
  const corso = {
    id,
    codice: "FORM-" + id,
    titolo: "Corso di Formazione sulla Sicurezza sul Lavoro",
    dataInizio: "2023-10-15",
    dataFine: "2023-11-15",
    sede: "Via Roma 123, Milano",
    moduloFormativo: "Sicurezza generale",
    giornateDiLezione: [
      { data: "2023-10-15", orario: "09:00 - 13:00", sede: "Aula Magna" },
      { data: "2023-10-22", orario: "09:00 - 13:00", sede: "Aula Magna" },
      { data: "2023-11-05", orario: "09:00 - 13:00", sede: "Laboratorio A" },
      { data: "2023-11-15", orario: "09:00 - 13:00", sede: "Aula Magna" }
    ],
    partecipanti: [
      { nome: "Mario", cognome: "Rossi", azienda: "TechSolutions Srl", ruolo: "Tecnico" },
      { nome: "Giulia", cognome: "Verdi", azienda: "TechSolutions Srl", ruolo: "Manager" },
      { nome: "Paolo", cognome: "Bianchi", azienda: "InnovaSpa", ruolo: "Operaio" },
      { nome: "Laura", cognome: "Neri", azienda: "InnovaSpa", ruolo: "Responsabile" }
    ],
    docenti: [
      { nome: "Prof. Alberto", cognome: "Mariani", specializzazione: "Sicurezza sul lavoro" }
    ],
    tutor: [
      { nome: "Dott.ssa Carla", cognome: "Esposito", ruolo: "Tutor d'aula" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50">
            {corso.titolo}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Codice: {corso.codice}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Genera PDF
          </Button>
          <Button>
            Modifica Corso
          </Button>
        </div>
      </div>

      <Tabs defaultValue="anagrafica" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="anagrafica">Anagrafica</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="partecipanti">Partecipanti</TabsTrigger>
          <TabsTrigger value="docenti">Docenti e Tutor</TabsTrigger>
        </TabsList>

        {/* Sezione Anagrafica */}
        <TabsContent value="anagrafica" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Corso</CardTitle>
              <CardDescription>Dati anagrafici del corso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Codice corso</p>
                  <p>{corso.codice}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Titolo</p>
                  <p>{corso.titolo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data inizio</p>
                  <p>{corso.dataInizio}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Data fine</p>
                  <p>{corso.dataFine}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sede</p>
                  <p>{corso.sede}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Modulo formativo</p>
                  <p>{corso.moduloFormativo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documenti</CardTitle>
              <CardDescription>File allegati al corso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center">
                  <File className="h-10 w-10 text-slate-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium">Nessun documento caricato</p>
                    <p className="text-sm text-slate-500">Carica i documenti relativi al corso</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Carica
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sezione Calendario */}
        <TabsContent value="calendario" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Calendario Didattico</CardTitle>
                <CardDescription>Giornate di lezione programmate</CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi Giornata
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Orario</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sede</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.giornateDiLezione.map((giornata, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{giornata.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{giornata.orario}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{giornata.sede}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">Modifica</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sezione Partecipanti */}
        <TabsContent value="partecipanti" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Elenco Partecipanti</CardTitle>
                <CardDescription>Studenti iscritti al corso</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Esporta
                </Button>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Aggiungi
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azienda</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ruolo</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.partecipanti.map((partecipante, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.cognome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.azienda}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{partecipante.ruolo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">Modifica</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sezione Docenti e Tutor */}
        <TabsContent value="docenti" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Docenti</CardTitle>
                <CardDescription>Professori e specialisti</CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi Docente
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specializzazione</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.docenti.map((docente, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{docente.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{docente.cognome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{docente.specializzazione}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">Modifica</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tutor</CardTitle>
                <CardDescription>Assistenti e supporto</CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi Tutor
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ruolo</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                    {corso.tutor.map((tutor, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{tutor.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{tutor.cognome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-50">{tutor.ruolo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">Modifica</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DettaglioCorso;

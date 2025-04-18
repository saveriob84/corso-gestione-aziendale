
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Logo placeholder - in una versione reale si userebbe un'immagine vera
const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUOSURBVHgB7ZtNaBxlGMf/78zsbnY3u022aVKTmgSF1BZpQRA8WC+CLR5EEE+epAjeKngQD548qQfx4kHwIAUP6kHwA7QgLYrYkoJ+QJtYm49Nkt3sbmbmeXxnd2aTbHY3ye7OA8n+YJiPd2Z35v0/z/M8z/POLBhjzNNorVF9/fVrr7zXaIwVi8VSLpfbN519X8h3UQfa7Taazeat+fl3jl+5cvqqpshijMl8+tmnvy1dunShWCyxrCBROOcKkyOTEye+/Ob7iYnJkizLouurq1+dO3fhMUUDD8hGvQ7GxzAxMam6CcmvFYt4+PDh92fPnntckY+/fP3RR8cz57pdaeCllFIwgIG+oQEwbVtn3vnkky9Jo4Tuvb9//+HMGVcMgyyk37RazvHPP3h/FoCh/3p5+ccXGGPBDLGUIrTWQ8td9V1KEZqx5y5fvvQxgPtBDJzvl1rtQWXQQkrJgVbzSN+FbEcQCRxROXfx4qUXASxJnM+4a4D25/8CE5VAqLu2aRZkLlN/a23wPc85p/ZWwzU8/h9JR9FghWgXGaivdO1CEpxaa0ipiH/FphmK1VWopJCmredu8DkfJm4BMq0SQkgIUVc0CAYqRCCsOCoiXDJs/XOx9cvH7WkuOBhjSmnt9RZl6Kr3dztohd/wJYsxKqTZXPe6HqmUIGYc5HM5hC1KVNyA7Dpu13eALCVZZpTrU9i2HbYIKV5BO46LTCYD23aEJGRQpKYholh1XA42xhqWUAMV0tmH7IZ7R0WlYqHZbMGyLK2k3L/PHiYhPgghUSiYcBwbU1MzcF0nPBHRZZ/9hUYMVIiPXn0IR8cOerX06ywZYkIADydnZuC4NhYXFyGlHFE54mGvPsQnTScdA6Vd52abFspjY/j77l04jrOESAp8NgqpeC2iKPkbDGpu1uv14Ub1Jl2uev5H02C7ijFNB7p2vXypkLD5jJQMjB0ICcGy9epKtT5wlNWubHtl9T7ajtMIcZZHzP6EkBCklBmn7RS6rbJ6kYYuZGtul3jj+YQQlRAZt1KpTdNG6EL6jUZxoN27bLQ+mU1mrPFJCNudIZpZpYREE7InfgcKag6w8Z/UxIVoTQP80wy9HikjcSFSisYwBbRvFP2Fi7iL0+913dAQstO47Zt0Uzemfy70RE48K63EIYrSNK8ZN3lbW6Q0tH9SPtj4DZoA9hVi1eo4Vii+pjnPpyFlY2N9MVSp0hjlaZcNKSEVQgNW5mr1V+VpB9IwZLW01CcfeeQoKpUK7VsKWYwku+h8LnqEVApRVaVan3j22dPkPxbKhiaFmqtnRGivHvbg3HBwQ+tSQXwXpCyv1AqnTj3/nJQCplkOd9KXlBJKRCscY1DVYGlMKSmsJAXxKRSKmD75GA7Mjfl7A/+oRfoQMQQhHggJkzx+f8Sqwe8QxYiuCcM3JZlOZ9SeE0IjNMdxkfH2avlcPlwA9MFau+ZYmnsQyz15U0kgIeQhZmHhLyzeueMdpC4UCh7pK8AorGLp7hLMckZ1DnXSWGc/luLIW4a3nJ2dnUW9XoOUe/MhG8smvgM0CkvkMMt0zo9xL+UXoLOnbIzCaqWKTNb2Tjjns1nk8zkqQqOsZ9i2ipknZjA/fw2NRoOK0Ch3iTKUDx08hFw+j+XlZZimScvcUYldWaxOlS9gfPwgtbxGGfsWpYRQPn5iCk7LwcLCDegRlqKVpnZXqGddfOI4KvfuYenOHZiZ8IoRVL5qa+hYRVmU8ixsd+mPcUyfmMbYgQNYuLmIXC47Ur7jf7L+yos5YPqDAAAAAElFTkSuQmCC';

// Classe per la generazione dei PDF
export class PdfGenerator {
  
  private doc: jsPDF;
  
  constructor(private options: {
    orientation?: 'portrait' | 'landscape',
    title?: string,
    includeLogo?: boolean
  } = {}) {
    this.doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }

  // Aggiungi intestazione standard
  private addHeader() {
    if (this.options.includeLogo) {
      this.doc.addImage(logoBase64, 'PNG', 15, 10, 30, 15);
    }
    
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.options.title || 'Documento Formativo', 50, 20);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 160, 15);
    this.doc.text(`Protocollo: ________________`, 160, 20);

    this.doc.line(15, 30, 195, 30); // linea orizzontale sotto l'intestazione
  }

  // Aggiungi piè di pagina standard
  private addFooter() {
    const pageCount = (this.doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.text(`Pagina ${i} di ${pageCount}`, 15, 285);
      this.doc.text('Documento generato automaticamente', 80, 285);
      this.doc.text(`Riferimento: D.Lgs. 81/2008 | Documento riservato`, 130, 285);
    }
  }

  // Genera PDF comunicazione inizio corso
  public generateInizioCorsoPdf(corso: any): string {
    this.options.title = "COMUNICAZIONE INIZIO CORSO";
    this.addHeader();
    
    // Informazioni corso
    this.doc.setFontSize(12);
    this.doc.text('INFORMAZIONI CORSO', 15, 40);
    
    this.doc.setFontSize(10);
    this.doc.text(`Titolo: ${corso.titolo}`, 15, 50);
    this.doc.text(`Codice: ${corso.codice}`, 15, 55);
    this.doc.text(`Data inizio: ${corso.dataInizio}`, 15, 60);
    this.doc.text(`Data fine: ${corso.dataFine}`, 15, 65);
    this.doc.text(`Sede: ${corso.sede}`, 15, 70);
    
    // Corpo comunicazione
    this.doc.setFontSize(11);
    this.doc.text('OGGETTO: Comunicazione inizio corso di formazione', 15, 85);
    
    this.doc.setFontSize(10);
    let bodyText = "Con la presente si comunica che in data " + corso.dataInizio + 
                  " avrà inizio il corso di formazione specificato in oggetto. " +
                  "Si prega di garantire la presenza dei partecipanti iscritti e di rispettare " +
                  "gli orari indicati nel calendario didattico allegato.\n\n" +
                  "Per qualsiasi informazione aggiuntiva, contattare la segreteria organizzativa.";
    
    const splitText = this.doc.splitTextToSize(bodyText, 170);
    this.doc.text(splitText, 15, 95);
    
    // Note e firma
    this.doc.text('Note aggiuntive:', 15, 120);
    this.doc.line(15, 125, 195, 125);
    this.doc.line(15, 130, 195, 130);
    
    this.doc.text('Il Responsabile del corso', 140, 150);
    this.doc.line(140, 160, 190, 160);
    
    this.addFooter();
    
    // Salva il PDF e restituisci il dataURL
    return this.doc.output('datauristring');
  }
  
  // Genera PDF comunicazione fine corso
  public generateFineCorsoPdf(corso: any): string {
    this.options.title = "COMUNICAZIONE FINE CORSO";
    this.addHeader();
    
    // Informazioni corso
    this.doc.setFontSize(12);
    this.doc.text('INFORMAZIONI CORSO', 15, 40);
    
    this.doc.setFontSize(10);
    this.doc.text(`Titolo: ${corso.titolo}`, 15, 50);
    this.doc.text(`Codice: ${corso.codice}`, 15, 55);
    this.doc.text(`Data inizio: ${corso.dataInizio}`, 15, 60);
    this.doc.text(`Data fine: ${corso.dataFine}`, 15, 65);
    this.doc.text(`Sede: ${corso.sede}`, 15, 70);
    
    // Corpo comunicazione
    this.doc.setFontSize(11);
    this.doc.text('OGGETTO: Comunicazione fine corso di formazione', 15, 85);
    
    this.doc.setFontSize(10);
    let bodyText = "Con la presente si comunica che in data " + corso.dataFine + 
                  " si è concluso il corso di formazione specificato in oggetto. " +
                  "Si informa che gli attestati di partecipazione saranno disponibili " +
                  "entro 30 giorni dalla data di conclusione del corso.\n\n" +
                  "Per qualsiasi informazione aggiuntiva, contattare la segreteria organizzativa.";
    
    const splitText = this.doc.splitTextToSize(bodyText, 170);
    this.doc.text(splitText, 15, 95);
    
    // Risultati corso
    this.doc.setFontSize(11);
    this.doc.text('RIEPILOGO CORSO', 15, 120);
    
    this.doc.setFontSize(10);
    this.doc.text(`Numero partecipanti totali: ${corso.partecipanti.length}`, 15, 130);
    this.doc.text(`Numero aziende coinvolte: ${corso.partecipanti.reduce((acc, p) => acc.includes(p.azienda) ? acc : [...acc, p.azienda], []).length}`, 15, 135);
    this.doc.text(`Ore formative erogate: ${corso.giornateDiLezione.length * 4}`, 15, 140);
    
    // Firma
    this.doc.text('Il Responsabile del corso', 140, 170);
    this.doc.line(140, 180, 190, 180);
    
    this.addFooter();
    
    // Salva il PDF e restituisci il dataURL
    return this.doc.output('datauristring');
  }
  
  // Genera PDF elenco partecipanti
  public generateElencoPartecipantiPdf(corso: any): string {
    this.options.title = "ELENCO PARTECIPANTI";
    this.addHeader();
    
    // Informazioni corso
    this.doc.setFontSize(12);
    this.doc.text('INFORMAZIONI CORSO', 15, 40);
    
    this.doc.setFontSize(10);
    this.doc.text(`Titolo: ${corso.titolo}`, 15, 50);
    this.doc.text(`Codice: ${corso.codice}`, 15, 55);
    this.doc.text(`Data inizio: ${corso.dataInizio}`, 15, 60);
    this.doc.text(`Data fine: ${corso.dataFine}`, 15, 65);
    
    // Tabella partecipanti
    this.doc.setFontSize(12);
    this.doc.text('ELENCO PARTECIPANTI', 15, 80);
    
    const tableColumn = ["Nome", "Cognome", "Azienda", "Ruolo"];
    const tableRows = corso.partecipanti.map(p => [p.nome, p.cognome, p.azienda, p.ruolo]);
    
    autoTable(this.doc, {
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246], // blue-500
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249] // slate-100
      },
      margin: { top: 85 }
    });
    
    // Sezione firme
    const finalY = (this.doc as any).lastAutoTable.finalY + 10;
    
    this.doc.text('Luogo e data: ___________________', 15, finalY + 10);
    
    this.doc.text('Il Responsabile del corso', 140, finalY + 10);
    this.doc.line(140, finalY + 20, 190, finalY + 20);
    
    this.addFooter();
    
    // Salva il PDF e restituisci il dataURL
    return this.doc.output('datauristring');
  }
  
  // Genera PDF elenco docenti e tutor
  public generateElencoDocentiTutorPdf(corso: any): string {
    this.options.title = "ELENCO DOCENTI E TUTOR";
    this.addHeader();
    
    // Informazioni corso
    this.doc.setFontSize(12);
    this.doc.text('INFORMAZIONI CORSO', 15, 40);
    
    this.doc.setFontSize(10);
    this.doc.text(`Titolo: ${corso.titolo}`, 15, 50);
    this.doc.text(`Codice: ${corso.codice}`, 15, 55);
    this.doc.text(`Data inizio: ${corso.dataInizio}`, 15, 60);
    this.doc.text(`Data fine: ${corso.dataFine}`, 15, 65);
    
    // Tabella docenti
    this.doc.setFontSize(12);
    this.doc.text('ELENCO DOCENTI', 15, 80);
    
    const docentiColumns = ["Nome", "Cognome", "Specializzazione"];
    const docentiRows = corso.docenti.map(d => [d.nome, d.cognome, d.specializzazione]);
    
    autoTable(this.doc, {
      startY: 85,
      head: [docentiColumns],
      body: docentiRows,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246], // blue-500
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249] // slate-100
      },
      margin: { top: 85 }
    });
    
    // Tabella tutor
    const finalYDocenti = (this.doc as any).lastAutoTable.finalY + 10;
    this.doc.setFontSize(12);
    this.doc.text('ELENCO TUTOR', 15, finalYDocenti);
    
    const tutorColumns = ["Nome", "Cognome", "Ruolo"];
    const tutorRows = corso.tutor.map(t => [t.nome, t.cognome, t.ruolo]);
    
    autoTable(this.doc, {
      startY: finalYDocenti + 5,
      head: [tutorColumns],
      body: tutorRows,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246], // blue-500
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249] // slate-100
      },
      margin: { top: finalYDocenti + 5 }
    });
    
    // Sezione firme
    const finalY = (this.doc as any).lastAutoTable.finalY + 10;
    
    this.doc.text('Luogo e data: ___________________', 15, finalY + 10);
    
    this.doc.text('Il Responsabile del corso', 140, finalY + 10);
    this.doc.line(140, finalY + 20, 190, finalY + 20);
    
    this.addFooter();
    
    // Salva il PDF e restituisci il dataURL
    return this.doc.output('datauristring');
  }
}

export default PdfGenerator;

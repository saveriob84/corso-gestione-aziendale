
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PdfGenerator from '@/utils/pdfGenerator';

interface PdfViewerProps {
  pdfType: 'inizioCorso' | 'fineCorso' | 'elencoPartecipanti' | 'elencoDocenti';
  corso: any;
  isOpen: boolean;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ 
  pdfType, 
  corso, 
  isOpen, 
  onClose 
}) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  
  React.useEffect(() => {
    if (isOpen && corso) {
      const generator = new PdfGenerator({
        includeLogo: true
      });
      
      let url = '';
      
      switch (pdfType) {
        case 'inizioCorso':
          url = generator.generateInizioCorsoPdf(corso);
          break;
        case 'fineCorso':
          url = generator.generateFineCorsoPdf(corso);
          break;
        case 'elencoPartecipanti':
          url = generator.generateElencoPartecipantiPdf(corso);
          break;
        case 'elencoDocenti':
          url = generator.generateElencoDocentiTutorPdf(corso);
          break;
      }
      
      setPdfUrl(url);
    }
  }, [isOpen, corso, pdfType]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{getPdfTitle(pdfType)}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full overflow-hidden">
          {pdfUrl && (
            <iframe 
              src={pdfUrl} 
              className="w-full h-full border-0"
              title={getPdfTitle(pdfType)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function getPdfTitle(pdfType: string): string {
  switch (pdfType) {
    case 'inizioCorso':
      return 'Comunicazione Inizio Corso';
    case 'fineCorso':
      return 'Comunicazione Fine Corso';
    case 'elencoPartecipanti':
      return 'Elenco Partecipanti';
    case 'elencoDocenti':
      return 'Elenco Docenti e Tutor';
    default:
      return 'Anteprima PDF';
  }
}

export default PdfViewer;

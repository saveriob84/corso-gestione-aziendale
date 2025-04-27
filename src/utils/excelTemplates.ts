
export const getParticipantTemplate = () => {
  return [
    {
      'Nome*': '',
      'Cognome*': '',
      'Codice Fiscale*': '',
      'Luogo di Nascita': '',
      'Data di Nascita (GG/MM/AAAA)*': '',
      'Username': '',
      'Password': '',
      'Numero di cellulare': '',
      'Titolo di Studio': '',
      'CCNL': '',
      'Tipologia contrattuale': '',
      'Qualifica professionale': '',
      'Anno di assunzione': '',
      'Ragione Sociale Azienda*': '',
      'Partita IVA Azienda': '',
      'Indirizzo Azienda': '',
      'Comune Azienda': '',
      'CAP Azienda': '',
      'Provincia Azienda': '',
      'Telefono Azienda': '',
      'Email Azienda': '',
      'Referente Azienda': '',
      'Codice ATECO': '',
      'Macrosettore': ''
    }
  ];
};

// Add a utility function to help debug Excel date values
export const getExcelDateDebugInfo = (excelValue: any): string => {
  if (typeof excelValue === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const milliseconds = excelValue * 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + milliseconds);
    
    return `Excel numeric value: ${excelValue}
    Type: ${typeof excelValue}
    Calculated date: ${date.toISOString()}
    Formatted: ${date.toLocaleDateString()}`;
  }
  
  if (typeof excelValue === 'string' && /^\d+(\.\d+)?$/.test(excelValue)) {
    const numValue = parseFloat(excelValue);
    const excelEpoch = new Date(1899, 11, 30);
    const milliseconds = numValue * 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + milliseconds);
    
    return `Excel string numeric value: "${excelValue}"
    Parsed as: ${numValue}
    Calculated date: ${date.toISOString()}
    Formatted: ${date.toLocaleDateString()}`;
  }
  
  return `Value: ${excelValue}
  Type: ${typeof excelValue}
  Not recognized as Excel date format`;
};


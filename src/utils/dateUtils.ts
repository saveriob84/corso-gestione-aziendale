
import { format, parse, isValid } from "date-fns";
import { it } from "date-fns/locale";

type DateFormat = {
  format: string;
  description: string;
};

const SUPPORTED_FORMATS: DateFormat[] = [
  { format: 'dd/MM/yyyy', description: 'GG/MM/AAAA' },
  { format: 'MM/dd/yyyy', description: 'MM/GG/AAAA' },
  { format: 'yyyy-MM-dd', description: 'AAAA-MM-GG' },
  { format: 'dd-MM-yyyy', description: 'GG-MM-AAAA' }
];

const EXCEL_EPOCH = new Date(1899, 11, 30); // Excel's date system starts from December 30, 1899

/**
 * Validates a date is within reasonable bounds
 */
const isReasonableDate = (date: Date): boolean => {
  const minYear = 1900;
  const maxYear = new Date().getFullYear();
  const year = date.getFullYear();
  
  if (year < minYear || year > maxYear) {
    console.log(`Date ${date.toISOString()} rejected: year ${year} outside reasonable range ${minYear}-${maxYear}`);
    return false;
  }
  
  return true;
};

/**
 * Attempts to parse an Excel numeric date format
 */
const parseExcelDate = (value: string | number): Date | null => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) return null;
  
  const date = new Date(EXCEL_EPOCH);
  date.setDate(date.getDate() + Math.floor(numericValue));
  
  if (!isReasonableDate(date)) return null;
  
  console.log(`Successfully parsed Excel numeric date ${value} to ${date.toISOString()}`);
  return date;
};

/**
 * Parses a date from various formats if it's not already a Date object
 */
export const parseDateIfNeeded = (dateValue: any): Date | undefined => {
  if (!dateValue) {
    console.log('No date value provided');
    return undefined;
  }
  
  // If already a Date object and valid
  if (dateValue instanceof Date) {
    if (!isValid(dateValue) || !isReasonableDate(dateValue)) {
      console.log(`Invalid or unreasonable Date object: ${dateValue}`);
      return undefined;
    }
    return dateValue;
  }
  
  // Handle string dates
  if (typeof dateValue === 'string') {
    // Try common Italian date formats
    for (const { format: dateFormat, description } of SUPPORTED_FORMATS) {
      const parsedDate = parse(dateValue, dateFormat, new Date());
      if (isValid(parsedDate) && isReasonableDate(parsedDate)) {
        console.log(`Successfully parsed date ${dateValue} using format ${description}`);
        return parsedDate;
      }
    }
    
    // Try parsing ISO string
    if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
      const timestamp = Date.parse(dateValue);
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp);
        if (isReasonableDate(date)) {
          console.log(`Successfully parsed ISO date ${dateValue}`);
          return date;
        }
      }
    }
    
    // Handle Excel date format (days since 1899-12-30)
    if (/^\d+(\.\d+)?$/.test(dateValue)) {
      const excelDate = parseExcelDate(dateValue);
      if (excelDate) return excelDate;
    }

    console.log(`Failed to parse date: ${dateValue}. Supported formats:`, 
      SUPPORTED_FORMATS.map(f => f.description).join(', '));
  }
  
  return undefined;
};

/**
 * Formats a Date object to a YYYY-MM-DD string (without time or timezone)
 * This ensures consistent date storage without timezone issues
 */
export const formatDateForStorage = (date: Date | undefined): string | null => {
  if (!date || !isValid(date)) {
    console.log('Invalid date provided to formatDateForStorage');
    return null;
  }
  
  const formattedDate = format(date, 'yyyy-MM-dd');
  console.log(`Formatting date for storage: ${date} -> ${formattedDate}`);
  return formattedDate;
};

/**
 * Formats a date for display in the Italian format (DD/MM/YYYY)
 */
export const formatDateForDisplay = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return '-';
  
  const date = dateValue instanceof Date ? dateValue : parseDateIfNeeded(dateValue);
  
  if (date && isValid(date)) {
    return format(date, 'dd/MM/yyyy', { locale: it });
  }
  
  return typeof dateValue === 'string' ? dateValue : '-';
};

/**
 * Helper function to get feedback on why a date might not be parsing correctly
 */
export const getDateParsingFeedback = (dateValue: any): string => {
  if (!dateValue) return 'Nessuna data fornita';
  
  if (dateValue instanceof Date) {
    if (!isValid(dateValue)) return 'Data non valida';
    if (!isReasonableDate(dateValue)) return 'Data fuori dall\'intervallo consentito (1900-presente)';
    return 'Data valida';
  }
  
  if (typeof dateValue === 'string') {
    if (dateValue.trim() === '') return 'Data vuota';
    return `Formati supportati: ${SUPPORTED_FORMATS.map(f => f.description).join(', ')}`;
  }
  
  return 'Formato data non supportato';
};


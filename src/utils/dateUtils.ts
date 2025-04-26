
import { format, parse, isValid } from "date-fns";
import { it } from "date-fns/locale";

/**
 * Parses a date from various formats if it's not already a Date object
 */
export const parseDateIfNeeded = (dateValue: any): Date | undefined => {
  if (!dateValue) return undefined;
  
  if (dateValue instanceof Date) return dateValue;
  
  if (typeof dateValue === 'string') {
    // Try parsing common date formats
    const formats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy'];
    
    for (const dateFormat of formats) {
      const parsedDate = parse(dateValue, dateFormat, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    
    // Try parsing ISO string
    const timestamp = Date.parse(dateValue);
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
    
    // Handle Excel date format (days since 1899-12-30)
    if (/^\d+$/.test(dateValue)) {
      const date = new Date(1899, 11, 30);
      date.setDate(date.getDate() + parseInt(dateValue));
      if (!isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < new Date().getFullYear()) {
        return date;
      }
    }
  }
  
  return undefined;
};

/**
 * Parses an initial date value that could be in various formats
 */
export const parseInitialDate = (dateString?: string | Date): Date | undefined => {
  if (!dateString) return undefined;
  
  if (dateString instanceof Date) return dateString;
  
  if (/^\d+$/.test(dateString)) {
    const date = new Date(1899, 11, 30);
    date.setDate(date.getDate() + parseInt(dateString));
    if (!isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < new Date().getFullYear()) {
      return date;
    }
  }
  
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  return undefined;
};

/**
 * Formats a Date object to a YYYY-MM-DD string (without time or timezone)
 * This ensures consistent date storage without timezone issues
 */
export const formatDateForStorage = (date: Date | undefined): string | null => {
  if (!date || !isValid(date)) return null;
  return format(date, 'yyyy-MM-dd');
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

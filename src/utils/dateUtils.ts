import { format, parseISO, isValid, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export interface DateFormatOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  format?: string;
}

export class DateUtils {
  private static readonly DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
  private static readonly DEFAULT_DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';
  private static readonly DEFAULT_DATETIME_WITH_SECONDS_FORMAT = 'yyyy-MM-dd HH:mm:ss';

  /**
   * Format a date to a string
   */
  static formatDate(date: Date | string | null, options: DateFormatOptions = {}): string {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      
      if (!isValid(dateObj)) {
        console.warn('Invalid date provided to formatDate:', date);
        return '';
      }

      if (options.format) {
        return format(dateObj, options.format);
      }

      if (options.includeSeconds) {
        return format(dateObj, this.DEFAULT_DATETIME_WITH_SECONDS_FORMAT);
      }

      if (options.includeTime) {
        return format(dateObj, this.DEFAULT_DATETIME_FORMAT);
      }

      return format(dateObj, this.DEFAULT_DATE_FORMAT);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  /**
   * Get current timestamp as ISO string
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Get current date as Date object
   */
  static getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Parse ISO string to Date object
   */
  static parseISOString(isoString: string): Date | null {
    try {
      const date = parseISO(isoString);
      return isValid(date) ? date : null;
    } catch (error) {
      console.error('Error parsing ISO string:', error);
      return null;
    }
  }

  /**
   * Get relative time description (e.g., "2 hours ago", "just now")
   */
  static getRelativeTime(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      
      if (!isValid(dateObj)) {
        return 'Invalid date';
      }

      const now = new Date();
      const diffInMinutes = differenceInMinutes(now, dateObj);
      const diffInHours = differenceInHours(now, dateObj);
      const diffInDays = differenceInDays(now, dateObj);

      if (diffInMinutes < 1) {
        return 'just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      } else {
        return this.formatDate(dateObj);
      }
    } catch (error) {
      console.error('Error calculating relative time:', error);
      return 'Unknown';
    }
  }

  /**
   * Check if a date is today
   */
  static isToday(date: Date | string): boolean {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      
      if (!isValid(dateObj)) {
        return false;
      }

      const today = new Date();
      return (
        dateObj.
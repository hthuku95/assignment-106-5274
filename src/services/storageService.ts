import { Note } from '../types/Note';

export class StorageService {
  private static readonly NOTES_KEY = 'notes-app-data';
  private static readonly SETTINGS_KEY = 'notes-app-settings';

  static saveNotes(notes: Note[]): void {
    try {
      const serializedNotes = JSON.stringify(notes);
      localStorage.setItem(this.NOTES_KEY, serializedNotes);
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
      throw new Error('Failed to save notes');
    }
  }

  static loadNotes(): Note[] {
    try {
      const serializedNotes = localStorage.getItem(this.NOTES_KEY);
      if (!serializedNotes) {
        return [];
      }
      
      const notes = JSON.parse(serializedNotes);
      return this.validateAndMigrateNotes(notes);
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      return [];
    }
  }

  static saveSettings(settings: Record<string, any>): void {
    try {
      const serializedSettings = JSON.stringify(settings);
      localStorage.setItem(this.SETTINGS_KEY, serializedSettings);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
      throw new Error('Failed to save settings');
    }
  }

  static loadSettings(): Record<string, any> {
    try {
      const serializedSettings = localStorage.getItem(this.SETTINGS_KEY);
      if (!serializedSettings) {
        return this.getDefaultSettings();
      }
      
      return JSON.parse(serializedSettings);
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      return this.getDefaultSettings();
    }
  }

  static clearAllData(): void {
    try {
      localStorage.removeItem(this.NOTES_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw new Error('Failed to clear data');
    }
  }

  static exportData(): string {
    try {
      const notes = this.loadNotes();
      const settings = this.loadSettings();
      
      const exportData = {
        notes,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  static importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!this.validateImportData(importData)) {
        throw new Error('Invalid import data format');
      }
      
      if (importData.notes) {
        this.saveNotes(importData.notes);
      }
      
      if (importData.settings) {
        this.saveSettings(importData.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const used = new Blob([JSON.stringify(localStorage)]).size;
      const available = 5 * 1024 * 1024; // Approximate 5MB limit
      const percentage = (used / available) * 100;
      
      return {
        used,
        available,
        percentage: Math.min(percentage, 100)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  private static validateAndMigrateNotes(notes: any[]): Note[] {
    if (!Array.isArray(notes)) {
      return [];
    }
    
    return notes
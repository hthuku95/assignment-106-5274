export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  category?: string;
  isPinned: boolean;
  isArchived: boolean;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
}

export interface UpdateNotePayload {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  category?: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface NoteFilter {
  searchTerm?: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
}

export interface NoteStats {
  totalNotes: number;
  pinnedNotes: number;
  archivedNotes: number;
  categoriesCount: number;
  tagsCount: number;
}

export type NoteAction = 'create' | 'update' | 'delete' | 'pin' | 'unpin' | 'archive' | 'unarchive';

export interface NoteEvent {
  action: NoteAction;
  note: Note;
  timestamp: Date;
}
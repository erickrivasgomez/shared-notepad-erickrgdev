import { Note } from '@/types/app.types';

export interface INoteRepository {
  getNotesByNotebookId(notebookId: string): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  createNote(notebookId: string, title?: string, content?: string): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}

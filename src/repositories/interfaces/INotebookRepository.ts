import { Notebook } from '@/types/app.types';

export interface INotebookRepository {
  getNotebooks(): Promise<Notebook[]>;
  getNotebookById(id: string): Promise<Notebook | null>;
  createNotebook(title: string, ownerId: string): Promise<Notebook>;
  updateNotebook(id: string, updates: Partial<Notebook>): Promise<Notebook>;
  deleteNotebook(id: string): Promise<void>;
}

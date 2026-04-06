import Dexie, { Table } from 'dexie';

export interface LocalNote {
  id: string;
  notebook_id: string;
  title: string;
  content: string;
  author_id: string;
  last_edited_by: string;
  last_edited_at: string;
  updated_at: string;
  is_deleted: boolean;
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _pendingOperation?: 'create' | 'update' | 'delete';
}

export interface LocalNotebook {
  id: string;
  title: string;
  owner_id: string;
  updated_at: string;
  _syncStatus: 'synced' | 'pending';
}

export class NotesDatabase extends Dexie {
  notes!: Table<LocalNote>;
  notebooks!: Table<LocalNotebook>;

  constructor() {
    super('NotesAppDB');
    this.version(1).stores({
      notes: 'id, notebook_id, updated_at, _syncStatus',
      notebooks: 'id, updated_at',
    });
  }
}

export const db = new NotesDatabase();

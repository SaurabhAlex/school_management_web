import api from './api';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
  id: string;
}

export const notesService = {
  async getNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  async updateNote(data: UpdateNoteData): Promise<Note> {
    const response = await api.put<Note>(`/notes/${data.id}`, data);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
}; 
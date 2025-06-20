import api from './api';
import type { Faculty } from './faculty';

export interface Class {
  _id: string;  // Making _id required since it's always present in responses
  name: string;
  section: string;
  academicYear: string;
  classTeacher: Faculty;
  capacity: number;
  description?: string;
}

export interface CreateClassData {
  name: string;
  section: string;
  academicYear: string;
  classTeacher: string; // We send classTeacher ID when creating/updating
  capacity: number;
  description?: string;
}

export interface UpdateClassData {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  classTeacher: string;
  capacity: number;
  description?: string;
}

export interface ClassResponse {
  classes: Class[];
  message?: string;
}

export const classService = {
  async getClasses(): Promise<ClassResponse> {
    const response = await api.get('/api/class/list');
    return response.data;
  },

  async addClass(data: CreateClassData): Promise<Class> {
    // Pad single digit numbers with leading zero
    const modifiedData = {
      ...data,
      name: /^[1-9]$/.test(data.name) ? `0${data.name}` : data.name
    };
    const response = await api.post<Class>('/api/class/add', modifiedData);
    return response.data;
  },

  async editClass(data: UpdateClassData): Promise<Class> {
    // Pad single digit numbers with leading zero
    const modifiedName = /^[1-9]$/.test(data.name) ? `0${data.name}` : data.name;
    const { id, ...updateData } = data;
    const response = await api.put<Class>(`/api/class/edit/${id}`, {
      name: modifiedName,
      section: data.section,
      academicYear: data.academicYear,
      classTeacher: data.classTeacher,
      capacity: data.capacity,
      description: data.description
    });
    return response.data;
  },

  async deleteClass(id: string): Promise<void> {
    await api.delete(`/api/class/delete/${id}`);
  },
}; 
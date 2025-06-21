import api from './api';

interface ClassTeacher {
  id: string;
  name: string;
  employeeId: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  classTeacher: ClassTeacher;
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

export interface UpdateClassData extends CreateClassData {
  id: string;
}

export interface ClassResponse {
  success: boolean;
  message?: string;
  classes: Class[];
}

export interface SingleClassResponse {
  success: boolean;
  message: string;
  class: Class;
}

export const classService = {
  async getClasses(): Promise<ClassResponse> {
    const response = await api.get('/api/class/list');
    return response.data;
  },

  async addClass(data: CreateClassData): Promise<SingleClassResponse> {
    // Pad single digit numbers with leading zero
    const modifiedData = {
      ...data,
      name: /^[1-9]$/.test(data.name) ? `0${data.name}` : data.name
    };
    const response = await api.post<SingleClassResponse>('/api/class/add', modifiedData);
    return response.data;
  },

  async editClass(data: UpdateClassData): Promise<SingleClassResponse> {
    const { id, ...updateData } = data;
    // Pad single digit numbers with leading zero
    const modifiedData = {
      ...updateData,
      name: /^[1-9]$/.test(updateData.name) ? `0${updateData.name}` : updateData.name
    };
    const response = await api.put<SingleClassResponse>(`/api/class/edit/${id}`, modifiedData);
    return response.data;
  },

  async deleteClass(id: string): Promise<void> {
    await api.delete(`/api/class/delete/${id}`);
  },
}; 
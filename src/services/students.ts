import api from './api';

export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export interface UpdateStudentData extends CreateStudentData {
  id?: string;
}

export const studentsService = {
  async getStudents(): Promise<Student[]> {
    const response = await api.get('/api/student/list');
    return response.data.students;
  },

  async addStudent(data: CreateStudentData): Promise<Student> {
    const response = await api.post<Student>('/api/student/add', data);
    return response.data;
  },

  async editStudent(data: UpdateStudentData): Promise<Student> {
    const response = await api.put<Student>(`/api/student/edit/${data.id}`, data);
    return response.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/api/student/delete/${id}`);
  },
}; 
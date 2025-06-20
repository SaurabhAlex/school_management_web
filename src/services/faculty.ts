import api from './api';

export interface Role {
  _id: string;
  name: string;
  description: string;
}

export interface Faculty {
  _id: string;
  facultyId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  department: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacultyData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  department: string;
  role: string; // We send role ID when creating/updating
}

// For edit operations, we don't send the IDs in the body
export interface UpdateFacultyData extends CreateFacultyData {}

export interface FacultyResponse {
  faculty: Faculty[];
  message?: string;
}

export const facultyService = {
  async getFaculty(): Promise<FacultyResponse> {
    const response = await api.get<FacultyResponse>('/api/faculty/list');
    return response.data;
  },

  async addFaculty(data: CreateFacultyData): Promise<Faculty> {
    const response = await api.post<Faculty>('/api/faculty/add', data, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    return response.data;
  },

  async editFaculty(id: string, data: UpdateFacultyData): Promise<Faculty> {
    if (!id) {
      throw new Error('Faculty ID is required for updates');
    }
    const response = await api.put<Faculty>(
      `/api/faculty/edit/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );
    return response.data;
  },

  async deleteFaculty(id: string): Promise<void> {
    if (!id) {
      throw new Error('Faculty ID is required for deletion');
    }
    await api.delete(`/api/faculty/delete/${id}`, {
      headers: {
        'accept': '*/*'
      }
    });
  },
}; 
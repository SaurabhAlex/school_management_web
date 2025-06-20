import api from './api';

export interface Role {
  _id?: string;
  name: string;
  description: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
}

export interface UpdateRoleData {
  id: string;
  name: string;
  description: string;
}

export interface RoleResponse {
  roles: Role[];
  message?: string;
}

export const roleService = {
  async getRoles(): Promise<RoleResponse> {
    const response = await api.get('/api/role/list');
    return response.data;
  },

  async addRole(data: CreateRoleData): Promise<Role> {
    const response = await api.post<Role>('/api/role/add', data);
    return response.data;
  },

  async editRole(data: UpdateRoleData): Promise<Role> {
    const response = await api.put<Role>(`/api/role/edit/${data.id}`, {
      name: data.name,
      description: data.description
    });
    return response.data;
  },

  async deleteRole(id: string): Promise<void> {
    await api.delete(`/api/role/delete/${id}`);
  },
}; 
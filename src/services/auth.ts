import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials, role: UserRole): Promise<AuthResponse> {
    let endpoint = '/auth/login'; // Default admin endpoint
    
    switch (role) {
      case 'faculty':
        endpoint = '/auth/faculty/login';
        break;
      case 'student':
        endpoint = '/auth/student/login';
        break;
      case 'admin':
        endpoint = '/auth/login'; // Admin uses the default login endpoint
        break;
    }
    
    const response = await api.post<AuthResponse>(endpoint, credentials);
    
    // Ensure role is set in the user object
    const userData = {
      ...response.data.user,
      role: role // Set the role explicitly
    };
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return {
      ...response.data,
      user: userData
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): AuthResponse['user'] | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      if (!user || typeof user !== 'object') return null;
      return user;
    } catch (error) {
      localStorage.removeItem('user'); // Clear invalid data
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
}; 
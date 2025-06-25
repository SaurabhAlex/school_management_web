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
  message: string;
  token: string;
  userId: string;
  role?: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export const authService = {
  async login(credentials: LoginCredentials, role: UserRole): Promise<AuthResponse> {
    let endpoint = '/api/auth/login'; // Default admin endpoint
    
    switch (role) {
      case 'faculty':
        endpoint = '/api/auth/faculty/login';
        break;
      case 'student':
        endpoint = '/api/auth/student/login';
        break;
      case 'admin':
        endpoint = '/api/auth/login'; // Admin uses the default login endpoint
        break;
    }
    
    const response = await api.post<AuthResponse>(endpoint, credentials);
    
    // Store the token and user data
    localStorage.setItem('token', response.data.token);
    
    // Create user object from response data
    const userData = {
      id: response.data.userId,
      email: response.data.email || credentials.email,
      role: role,
      firstName: response.data.firstName,
      lastName: response.data.lastName
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    return {
      ...response.data,
      role: role // Ensure role is included in response
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/signup', data);
    localStorage.setItem('token', response.data.token);
    
    const userData = {
      id: response.data.userId,
      email: data.email,
      role: 'student' as UserRole, // Default role for new registrations
      firstName: response.data.firstName,
      lastName: response.data.lastName
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
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

  getUser(): { id: string; email: string; role?: UserRole; firstName?: string; lastName?: string; } | null {
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
import { ApiClient } from '../repository/ApiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>(
      '/auth/register',
      credentials
    );
    return response;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response;
  }

  async logout(): Promise<void> {
    await this.apiClient.post('/auth/logout', {});
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.apiClient.get<User>('/auth/user');
    return response;
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.apiClient.setAuthToken(token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
    this.apiClient.clearAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

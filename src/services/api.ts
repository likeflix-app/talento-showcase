/**
 * API Service - Backend communication
 * Handles all API calls to the Talento Backend
 */

// Use environment variable for API URL, fallback to /api for local dev with proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  mobile?: string;
  createdAt: string;
  emailVerified: boolean;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic fetch wrapper
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ API Error ${response.status}:`, data);
        return {
          success: false,
          message: data.message || 'API request failed',
          error: data.error,
        };
      }

      console.log(`✅ API Success ${endpoint}:`, data);
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error(`❌ API Network Error ${endpoint}:`, error);
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.fetchApi('/health');
  }

  // Get all verified users
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.fetchApi('/users');
  }

  // Create new verified user
  async createUser(userData: {
    email: string;
    name: string;
    mobile?: string;
  }): Promise<ApiResponse<User>> {
    return this.fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.fetchApi('/users/stats');
  }

  // Update user role
  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<ApiResponse<User>> {
    return this.fetchApi(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Delete user
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

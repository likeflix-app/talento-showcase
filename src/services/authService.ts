/**
 * Auth Service - Backend-based authentication
 * Handles registration, login, and email verification with backend API
 */

import { apiService, User } from './api';
import { emailService } from './emailService';

export interface RegistrationData {
  email: string;
  name: string;
  password: string;
  mobile?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Configuration for admin access
const ADMIN_CONFIG = {
  email: 'admin@talento.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin' as const
};

class AuthService {
  private currentUser: User | null = null;

  // Register a new user
  async register(data: RegistrationData): Promise<User> {
    console.log('🚀 Auth - Starting registration for:', data.email);
    
    // Create new user object
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      emailVerified: false,
      mobile: data.mobile || '',
    };

    console.log('✅ Auth - User registration data prepared:', newUser);

    // Generate verification token (simple approach)
    const token = this.generateToken();
    this.storeVerificationToken(newUser.id, token);

    // Send verification email
    await this.sendVerificationEmail(newUser.email, token, newUser);

    return newUser;
  }

  // Verify email and send to backend
  async verifyEmail(token: string): Promise<boolean> {
    console.log('🔍 Auth - Verifying token:', token);
    
    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      console.log('❌ Auth - Invalid token');
      return false;
    }

    // Get user data from localStorage (temporary storage during verification)
    const userData = this.getPendingUser(userId);
    if (!userData) {
      console.log('❌ Auth - User data not found for verification');
      return false;
    }

    console.log('✅ Auth - User data found for verification:', userData);

    // Send user to backend API
    try {
      const response = await apiService.createUser({
        email: userData.email,
        name: userData.name,
        mobile: userData.mobile || '',
      });

      if (response.success) {
        console.log('✅ Auth - User sent to backend successfully:', response.data);
        
        // Clear temporary data
        this.clearPendingUser(userId);
        this.clearVerificationToken(userId);
        
        return true;
      } else {
        console.log('❌ Auth - Failed to send user to backend:', response.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Auth - Error sending user to backend:', error);
      return false;
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    console.log('🔍 Auth - Login attempt for:', credentials.email);
    
    // Check if this is the admin user first
    if (credentials.email === ADMIN_CONFIG.email) {
      console.log('🔍 Auth - Admin login attempt');
      
      if (credentials.password !== ADMIN_CONFIG.password) {
        console.log('❌ Auth - Invalid admin password');
        throw new Error('Invalid email or password');
      }

      // Create admin user object
      const adminUser: User = {
        id: 'admin-001',
        email: ADMIN_CONFIG.email,
        name: ADMIN_CONFIG.name,
        role: ADMIN_CONFIG.role,
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      this.currentUser = adminUser;
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      console.log('✅ Auth - Admin login successful:', adminUser);
      
      return adminUser;
    }
    
    // For regular users, check if they exist in backend
    try {
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        const user = response.data.find(u => u.email === credentials.email);
        if (user) {
          // Simple password check (in real app, use proper authentication)
          if (credentials.password !== 'password') {
            console.log('❌ Auth - Invalid password');
            throw new Error('Invalid email or password');
          }

          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log('✅ Auth - User login successful:', user);
          
          return user;
        }
      }
    } catch (error) {
      console.error('❌ Auth - Error checking user:', error);
    }
    
    console.log('❌ Auth - User not found');
    throw new Error('Invalid email or password');
  }

  // Get current user
  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  // Logout
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    console.log('👋 Auth - User logged out');
  }

  // Generate simple token
  private generateToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Store verification token
  private storeVerificationToken(userId: string, token: string): void {
    localStorage.setItem(`verification_${userId}`, token);
    console.log('🎫 Auth - Verification token stored for user:', userId);
  }

  // Get user ID from token
  private getUserIdFromToken(token: string): string | null {
    const allKeys = Object.keys(localStorage);
    for (const key of allKeys) {
      if (key.startsWith('verification_') && localStorage.getItem(key) === token) {
        return key.replace('verification_', '');
      }
    }
    return null;
  }

  // Clear verification token
  private clearVerificationToken(userId: string): void {
    localStorage.removeItem(`verification_${userId}`);
    console.log('🗑️ Auth - Verification token cleared for user:', userId);
  }

  // Store pending user data (temporary storage during verification)
  private storePendingUser(userId: string, userData: User): void {
    localStorage.setItem(`pending_user_${userId}`, JSON.stringify(userData));
    console.log('💾 Auth - Pending user data stored:', userId);
  }

  // Get pending user data
  private getPendingUser(userId: string): User | null {
    const stored = localStorage.getItem(`pending_user_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  // Clear pending user data
  private clearPendingUser(userId: string): void {
    localStorage.removeItem(`pending_user_${userId}`);
    console.log('🗑️ Auth - Pending user data cleared:', userId);
  }

  // Send verification email
  private async sendVerificationEmail(email: string, token: string, userData: User): Promise<void> {
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
    
    console.log('📧 Auth - Sending verification email to:', email);
    console.log('🔗 Auth - Verification URL:', verificationUrl);
    
    // Store user data temporarily for verification
    this.storePendingUser(userData.id, userData);
    
    try {
      // Send actual verification email
      const result = await emailService.sendVerificationEmail(
        email,
        userData.name,
        verificationUrl
      );
      
      if (result.success) {
        console.log('✅ Auth - Verification email sent successfully');
      } else {
        console.error('❌ Auth - Failed to send verification email:', result.message);
      }
    } catch (error) {
      console.error('❌ Auth - Error sending verification email:', error);
    }
  }
}

export const authService = new AuthService();
export { ADMIN_CONFIG };

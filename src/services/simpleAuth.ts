/**
 * SIMPLE AUTH - Direct localStorage registration and verification
 * This bypasses all the complex services and goes straight to localStorage
 */

import { simpleUserStorage, SimpleUser } from './simpleUserStorage';

export interface SimpleRegistrationData {
  email: string;
  name: string;
  password: string;
}

export interface SimpleLoginCredentials {
  email: string;
  password: string;
}

class SimpleAuthService {
  private currentUser: SimpleUser | null = null;

  // Register a new user
  async register(data: SimpleRegistrationData): Promise<SimpleUser> {
    console.log('🚀 Simple Auth - Starting registration for:', data.email);
    
    // Check if user already exists
    const existingUser = simpleUserStorage.findUserByEmail(data.email);
    if (existingUser) {
      console.log('❌ Simple Auth - User already exists:', data.email);
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: SimpleUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      emailVerified: false, // Start as unverified
    };

    // Add to storage
    simpleUserStorage.addUser(newUser);
    console.log('✅ Simple Auth - User registered:', newUser);

    // Generate verification token (simple approach)
    const token = this.generateToken();
    this.storeVerificationToken(newUser.id, token);

    // Send verification email (mock)
    this.sendVerificationEmail(newUser.email, token);

    return newUser;
  }

  // Verify email
  async verifyEmail(token: string): Promise<boolean> {
    console.log('🔍 Simple Auth - Verifying token:', token);
    
    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      console.log('❌ Simple Auth - Invalid token');
      return false;
    }

    // Verify user
    const success = simpleUserStorage.verifyUser(userId);
    if (success) {
      console.log('✅ Simple Auth - Email verified successfully');
      // Clear token
      this.clearVerificationToken(userId);
    }

    return success;
  }

  // Login user
  async login(credentials: SimpleLoginCredentials): Promise<SimpleUser> {
    console.log('🔍 Simple Auth - Login attempt for:', credentials.email);
    
    const user = simpleUserStorage.findUserByEmail(credentials.email);
    if (!user) {
      console.log('❌ Simple Auth - User not found');
      throw new Error('Invalid email or password');
    }

    // Simple password check (in real app, hash passwords)
    if (credentials.password !== 'password') {
      console.log('❌ Simple Auth - Invalid password');
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      console.log('❌ Simple Auth - Email not verified');
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('✅ Simple Auth - Login successful:', user);
    
    return user;
  }

  // Get current user
  getCurrentUser(): SimpleUser | null {
    return this.currentUser;
  }

  // Logout
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    console.log('👋 Simple Auth - User logged out');
  }

  // Generate simple token
  private generateToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Store verification token
  private storeVerificationToken(userId: string, token: string): void {
    localStorage.setItem(`verification_${userId}`, token);
    console.log('🎫 Simple Auth - Verification token stored for user:', userId);
  }

  // Get user ID from token
  private getUserIdFromToken(token: string): string | null {
    // Simple token lookup - in real app, use JWT or database
    const allUsers = simpleUserStorage.getAllUsers();
    for (const user of allUsers) {
      const storedToken = localStorage.getItem(`verification_${user.id}`);
      if (storedToken === token) {
        return user.id;
      }
    }
    return null;
  }

  // Clear verification token
  private clearVerificationToken(userId: string): void {
    localStorage.removeItem(`verification_${userId}`);
    console.log('🗑️ Simple Auth - Verification token cleared for user:', userId);
  }

  // Send verification email (mock)
  private sendVerificationEmail(email: string, token: string): void {
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
    
    console.log('📧 Simple Auth - Verification email would be sent to:', email);
    console.log('🔗 Simple Auth - Verification URL:', verificationUrl);
    
    // In a real app, send actual email here
    // For now, just log the URL
    alert(`Verification email sent to ${email}!\n\nClick this link to verify:\n${verificationUrl}`);
  }
}

export const simpleAuthService = new SimpleAuthService();

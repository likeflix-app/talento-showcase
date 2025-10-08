import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { emailVerificationService } from './emailVerification';

export class AuthServiceSupabase {
  private static instance: AuthServiceSupabase;
  private currentUser: User | null = null;

  static getInstance(): AuthServiceSupabase {
    if (!AuthServiceSupabase.instance) {
      AuthServiceSupabase.instance = new AuthServiceSupabase();
    }
    return AuthServiceSupabase.instance;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // First, check if user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (userError || !userData) {
        throw new Error('Invalid email or password');
      }

      // Check if email is verified
      if (!userData.email_verified) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      // In a real app, you'd verify the password here
      // For demo purposes, we'll accept any password
      if (credentials.password !== 'password') {
        throw new Error('Invalid email or password');
      }

      // Convert database format to our User type
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: userData.created_at,
        emailVerified: userData.email_verified,
      };

      this.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', credentials.email)
        .single();

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user in database
      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert({
          email: credentials.email,
          name: credentials.name,
          role: 'user',
          email_verified: false,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error('Failed to create user account');
      }

      // Convert database format to our User type
      const newUser: User = {
        id: newUserData.id,
        email: newUserData.email,
        name: newUserData.name,
        role: newUserData.role,
        createdAt: newUserData.created_at,
        emailVerified: newUserData.email_verified,
      };

      // Generate verification token and send email
      await emailVerificationService.generateVerificationToken(newUser.id);
      await emailVerificationService.resendVerificationEmail(newUser.id);

      // Return user but they are NOT logged in
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Method to sync current user with database
  async syncCurrentUser(): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && userData) {
        const updatedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: userData.created_at,
          emailVerified: userData.email_verified,
        };
        
        this.currentUser = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  }
}

export const authServiceSupabase = AuthServiceSupabase.getInstance();

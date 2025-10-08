import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { emailService } from './emailService';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a random verification token
const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
};

// Generate expiration time (24 hours from now)
const generateExpirationTime = (): string => {
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24);
  return expirationTime.toISOString();
};

export class EmailVerificationServiceSupabase {
  private static instance: EmailVerificationServiceSupabase;

  static getInstance(): EmailVerificationServiceSupabase {
    if (!EmailVerificationServiceSupabase.instance) {
      EmailVerificationServiceSupabase.instance = new EmailVerificationServiceSupabase();
    }
    return EmailVerificationServiceSupabase.instance;
  }

  // Generate verification token and update user
  async generateVerificationToken(userId: string): Promise<string> {
    await delay(500); // Simulate API call

    const token = generateVerificationToken();
    const expires = generateExpirationTime();

    // Debug: Log token generation
    console.log('🔑 Generating token for user:', userId);
    console.log('🎫 Generated token:', token);
    console.log('⏰ Expires at:', expires);

    try {
      // Update user in database
      const { error } = await supabase
        .from('users')
        .update({
          email_verification_token: token,
          email_verification_expires: expires,
        })
        .eq('id', userId);

      if (error) {
        throw new Error('Failed to update user verification token');
      }

      console.log('✅ Updated user in database with verification token');
      return token;
    } catch (error) {
      console.error('❌ Error updating user verification token:', error);
      throw error;
    }
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    await delay(1000); // Simulate API call

    console.log('🔍 Verifying token:', token);
    console.log('🔍 Token type:', typeof token);
    console.log('🔍 Token length:', token?.length);

    try {
      // Find user with matching token and valid expiration
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email_verification_token', token)
        .not('email_verification_expires', 'is', null)
        .single();

      if (error || !user) {
        console.log('❌ Token validation failed - user not found');
        return {
          success: false,
          message: 'Invalid or expired verification token'
        };
      }

      // Check if token is expired
      const now = new Date();
      const expires = new Date(user.email_verification_expires);
      
      if (expires <= now) {
        console.log('❌ Token expired');
        return {
          success: false,
          message: 'Verification token has expired'
        };
      }

      // Mark email as verified
      const { error: updateError } = await supabase
        .from('users')
        .update({
          email_verified: true,
          email_verification_token: null,
          email_verification_expires: null,
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error('Failed to verify email');
      }

      console.log('✅ Email verified successfully for user:', user.email);

      return {
        success: true,
        message: 'Email verified successfully!'
      };
    } catch (error) {
      console.error('❌ Error verifying email:', error);
      return {
        success: false,
        message: 'An error occurred during verification'
      };
    }
  }

  // Resend verification email
  async resendVerificationEmail(userId: string): Promise<{ success: boolean; message: string }> {
    await delay(500); // Simulate API call

    try {
      const token = await this.generateVerificationToken(userId);
      
      // Get user data
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Generate verification URL
      const verificationUrl = this.getVerificationUrl(token);
      console.log('🔗 Generated verification URL:', verificationUrl);
      console.log('🌐 Base URL being used:', 'https://frontend-isadora.onrender.com');
      
      // Send real email using the email service
      const emailResult = await emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationUrl
      );

      // Fallback to console logging if email service fails
      if (!emailResult.success) {
        console.log(`Verification email sent with token: ${token}`);
        console.log(`Verification link: ${verificationUrl}`);
      }
      
      return {
        success: true,
        message: emailResult.success ? 'Verification email sent successfully!' : 'Verification email logged (service not configured)'
      };
    } catch (error) {
      console.error('❌ Error resending verification email:', error);
      return {
        success: false,
        message: 'Failed to send verification email'
      };
    }
  }

  // Check if user needs email verification
  needsEmailVerification(user: User): boolean {
    return !user.emailVerified;
  }

  // Get verification URL (for demo purposes)
  getVerificationUrl(token: string): string {
    // Always use production URL for verification links
    const baseUrl = 'https://frontend-isadora.onrender.com';
    return `${baseUrl}/verify-email?token=${token}`;
  }
}

export const emailVerificationServiceSupabase = EmailVerificationServiceSupabase.getInstance();

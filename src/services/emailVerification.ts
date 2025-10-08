import { User } from '@/types/auth';
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

export class EmailVerificationService {
  private static instance: EmailVerificationService;

  static getInstance(): EmailVerificationService {
    if (!EmailVerificationService.instance) {
      EmailVerificationService.instance = new EmailVerificationService();
    }
    return EmailVerificationService.instance;
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

    // Update user in localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userIndex = allUsers.findIndex((u: User) => u.id === userId);
    
    if (userIndex !== -1) {
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        emailVerificationToken: token,
        emailVerificationExpires: expires,
      };
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      console.log('✅ Updated user in allUsers array:', allUsers[userIndex]);
    } else {
      console.log('❌ User not found in allUsers array');
    }

    // Also update current user if it's the same user
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser && currentUser.id === userId) {
      currentUser.emailVerificationToken = token;
      currentUser.emailVerificationExpires = expires;
      localStorage.setItem('user', JSON.stringify(currentUser));
      console.log('✅ Updated current user:', currentUser);
    }

    return token;
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    await delay(1000); // Simulate API call

    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Debug: Log token and users for debugging
    console.log('🔍 Verifying token:', token);
    console.log('🔍 Token type:', typeof token);
    console.log('🔍 Token length:', token?.length);
    console.log('👥 All users:', allUsers);
    console.log('🔑 Looking for token in users...');
    
    const userIndex = allUsers.findIndex((u: User) => {
      console.log(`User ${u.email}: token=${u.emailVerificationToken}, expires=${u.emailVerificationExpires}`);
      return u.emailVerificationToken === token && 
        u.emailVerificationExpires && 
        new Date(u.emailVerificationExpires) > new Date();
    });

    console.log('🎯 User index found:', userIndex);

    if (userIndex === -1) {
      console.log('❌ Token validation failed');
      return {
        success: false,
        message: 'Invalid or expired verification token'
      };
    }

    // Mark email as verified
    allUsers[userIndex] = {
      ...allUsers[userIndex],
      emailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    };
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Also update current user if it's the same user
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser && currentUser.id === allUsers[userIndex].id) {
      currentUser.emailVerified = true;
      currentUser.emailVerificationToken = undefined;
      currentUser.emailVerificationExpires = undefined;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    return {
      success: true,
      message: 'Email verified successfully!'
    };
  }

  // Resend verification email
  async resendVerificationEmail(userId: string): Promise<{ success: boolean; message: string }> {
    await delay(500); // Simulate API call

    try {
      const token = await this.generateVerificationToken(userId);
      
      // Get user data
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const user = allUsers.find((u: User) => u.id === userId);
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Generate verification URL
      const verificationUrl = this.getVerificationUrl(token);
      console.log('🔗 Generated verification URL:', verificationUrl);
      
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

export const emailVerificationService = EmailVerificationService.getInstance();

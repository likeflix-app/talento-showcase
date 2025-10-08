import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { emailVerificationService } from './emailVerification';

// Mock users database (in a real app, this would be a backend API)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
    createdAt: new Date().toISOString(),
    emailVerified: true,
  },
  {
    id: '2',
    email: 'admin@talento.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
    emailVerified: true,
  }
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
      // Initialize allUsers in localStorage with mock users
      const existingAllUsers = localStorage.getItem('allUsers');
      if (!existingAllUsers) {
        localStorage.setItem('allUsers', JSON.stringify(mockUsers));
      }
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    await delay(1000); // Simulate API call

    // Check both mockUsers and allUsers from localStorage
    let user = mockUsers.find(u => u.email === credentials.email);
    
    // If not found in mockUsers, check allUsers from localStorage
    if (!user) {
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      user = allUsers.find((u: User) => u.email === credentials.email);
    }
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, you'd verify the password here
    if (credentials.password !== 'password') {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    await delay(1000); // Simulate API call

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const existingUser = mockUsers.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      role: 'user',
      createdAt: new Date().toISOString(),
      emailVerified: false,
    };

    mockUsers.push(newUser);
    
    // DO NOT log in the user - they must verify email first
    // this.currentUser = newUser; // REMOVED
    // localStorage.setItem('user', JSON.stringify(newUser)); // REMOVED
    
    // Store in the allUsers array for admin panel
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Generate verification token and send email
    await emailVerificationService.generateVerificationToken(newUser.id);
    
    // Send verification email immediately after registration
    await emailVerificationService.resendVerificationEmail(newUser.id);
    
    // Return user but they are NOT logged in
    return newUser;
  }

  async logout(): Promise<void> {
    await delay(500); // Simulate API call
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
}

export const authService = AuthService.getInstance();

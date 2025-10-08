/**
 * SIMPLE USER STORAGE - Direct localStorage access
 * This bypasses all the complex services and goes straight to localStorage
 */

export interface SimpleUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  emailVerified: boolean;
}

const STORAGE_KEY = 'talento_users';

export const simpleUserStorage = {
  // Get all users from localStorage
  getAllUsers(): SimpleUser[] {
    try {
      const users = localStorage.getItem(STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return [];
    }
  },

  // Get only verified users
  getVerifiedUsers(): SimpleUser[] {
    const allUsers = this.getAllUsers();
    return allUsers.filter(user => user.emailVerified === true);
  },

  // Add a new user
  addUser(user: SimpleUser): void {
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    console.log('✅ Simple Storage - User added:', user);
  },

  // Update user verification status
  verifyUser(userId: string): boolean {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].emailVerified = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      console.log('✅ Simple Storage - User verified:', users[userIndex]);
      return true;
    }
    
    console.log('❌ Simple Storage - User not found for verification:', userId);
    return false;
  },

  // Find user by email
  findUserByEmail(email: string): SimpleUser | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  },

  // Clear all users (for testing)
  clearAllUsers(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Simple Storage - All users cleared');
  },

  // Initialize with default users
  initializeDefaultUsers(): void {
    const users = this.getAllUsers();
    if (users.length === 0) {
      const defaultUsers: SimpleUser[] = [
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
      console.log('✅ Simple Storage - Default users initialized');
    }
  }
};

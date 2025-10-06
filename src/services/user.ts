import { User } from '@/types/auth';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getAllUsers(): Promise<User[]> {
    await delay(500);
    // In a real app, this would fetch from the backend
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // If no users exist, initialize with the mock users from auth service
    if (users.length === 0) {
      const mockUsers = [
        {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'user' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'admin@talento.com',
          name: 'Admin User',
          role: 'admin' as const,
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('allUsers', JSON.stringify(mockUsers));
      return mockUsers;
    }
    
    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    await delay(300);
    const users = await this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  async updateUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    await delay(1000);
    
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].role = role;
    localStorage.setItem('allUsers', JSON.stringify(users));
    
    return users[userIndex];
  }

  async deleteUser(id: string): Promise<void> {
    await delay(1000);
    
    const users = await this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem('allUsers', JSON.stringify(filteredUsers));
  }

  async getUsersCount(): Promise<number> {
    await delay(300);
    const users = await this.getAllUsers();
    return users.length;
  }

  async getAdminsCount(): Promise<number> {
    await delay(300);
    const users = await this.getAllUsers();
    return users.filter(user => user.role === 'admin').length;
  }
}

export const userService = UserService.getInstance();

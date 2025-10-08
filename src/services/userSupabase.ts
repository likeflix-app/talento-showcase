import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';

export class UserServiceSupabase {
  private static instance: UserServiceSupabase;

  static getInstance(): UserServiceSupabase {
    if (!UserServiceSupabase.instance) {
      UserServiceSupabase.instance = new UserServiceSupabase();
    }
    return UserServiceSupabase.instance;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email_verified', true) // Only get verified users
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch users');
      }

      // Convert database format to our User type
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        emailVerified: user.email_verified,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !user) {
        return null;
      }

      // Convert database format to our User type
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        emailVerified: user.email_verified,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async updateUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to update user role');
      }

      // Convert database format to our User type
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        createdAt: updatedUser.created_at,
        emailVerified: updatedUser.email_verified,
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUsersCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('email_verified', true);

      if (error) {
        throw new Error('Failed to get users count');
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting users count:', error);
      return 0;
    }
  }

  async getAdminsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')
        .eq('email_verified', true);

      if (error) {
        throw new Error('Failed to get admins count');
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting admins count:', error);
      return 0;
    }
  }

  // Get all users including unverified (for admin purposes)
  async getAllUsersIncludingUnverified(): Promise<User[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch users');
      }

      // Convert database format to our User type
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        emailVerified: user.email_verified,
      }));
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
}

export const userServiceSupabase = UserServiceSupabase.getInstance();

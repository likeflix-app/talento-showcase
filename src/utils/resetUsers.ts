import { supabase } from '@/lib/supabase';

/**
 * Reset all users to only keep the admin user
 * This function clears localStorage and optionally Supabase database
 */
export const resetUsers = async (clearSupabase: boolean = false): Promise<void> => {
  console.log('🧹 Starting user reset...');

  // 1. Clear localStorage users
  console.log('🗑️ Clearing localStorage users...');
  localStorage.removeItem('allUsers');
  localStorage.removeItem('user');

  // 2. Reset localStorage with only admin user
  console.log('👤 Setting up default admin user in localStorage...');
  const defaultUsers = [
    {
      id: '2',
      email: 'admin@talento.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    }
  ];
  localStorage.setItem('allUsers', JSON.stringify(defaultUsers));

  // 3. If Supabase is configured, clear database users too
  if (clearSupabase) {
    console.log('🗄️ Clearing Supabase users...');
    try {
      // Delete all users except admin
      const { error } = await supabase
        .from('users')
        .delete()
        .neq('email', 'admin@talento.com');

      if (error) {
        console.error('❌ Error clearing Supabase users:', error);
        throw error;
      }

      console.log('✅ Supabase users cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear Supabase users:', error);
      // Don't throw error, continue with localStorage reset
    }
  }

  console.log('✅ User reset completed! Only admin user remains.');
};

/**
 * Get current user count for verification
 */
export const getUserCount = async (): Promise<{ localStorage: number; supabase?: number }> => {
  const localStorageUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const result: { localStorage: number; supabase?: number } = {
    localStorage: localStorageUsers.length
  };

  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      result.supabase = count || 0;
    }
  } catch (error) {
    // Supabase not configured or error, ignore
  }

  return result;
};

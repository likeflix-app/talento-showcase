/**
 * Reset all users to only keep the admin user
 * This function clears localStorage users
 */
export const resetUsers = async (): Promise<void> => {
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

  console.log('✅ User reset completed! Only admin user remains.');
};

/**
 * Get current user count for verification
 */
export const getUserCount = async (): Promise<{ localStorage: number }> => {
  const localStorageUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  return {
    localStorage: localStorageUsers.length
  };
};

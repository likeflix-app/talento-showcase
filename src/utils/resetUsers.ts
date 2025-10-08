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

/**
 * Manually verify all users (for testing purposes)
 */
export const verifyAllUsers = async (): Promise<void> => {
  console.log('✅ Manually verifying all users...');
  
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  
  const updatedUsers = allUsers.map((user: any) => ({
    ...user,
    emailVerified: true,
    emailVerificationToken: undefined,
    emailVerificationExpires: undefined,
  }));
  
  localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  
  console.log(`✅ Verified ${updatedUsers.length} users`);
};

/**
 * Debug function to see all users
 */
export const debugUsers = (): any[] => {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  
  console.log('🔍 Debug Users:');
  console.log('📊 Total users:', allUsers.length);
  
  allUsers.forEach((user: any, index: number) => {
    console.log(`${index + 1}. ${user.name} (${user.email})`);
    console.log(`   - Verified: ${user.emailVerified}`);
    console.log(`   - Role: ${user.role}`);
    console.log('---');
  });
  
  const verified = allUsers.filter((u: any) => u.emailVerified);
  const unverified = allUsers.filter((u: any) => !u.emailVerified);
  
  console.log(`✅ Verified: ${verified.length}, ⏳ Unverified: ${unverified.length}`);
  
  return allUsers;
};

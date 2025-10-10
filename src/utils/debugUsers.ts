/**
 * Debug utility to help troubleshoot user registration and verification issues
 */

export const debugUsers = () => {
  console.log('🔍 DEBUGGING USER SYSTEM');
  console.log('========================');
  
  // Check localStorage users (legacy - now using backend)
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  console.log('📊 Total users in localStorage (legacy):', allUsers.length);
  console.log('👥 All users (legacy):', allUsers);
  
  // Check verified users (legacy)
  const verifiedUsers = allUsers.filter(user => user.emailVerified === true);
  console.log('✅ Verified users:', verifiedUsers.length);
  console.log('📋 Verified users list:', verifiedUsers);
  
  // Check unverified users
  const unverifiedUsers = allUsers.filter(user => user.emailVerified === false);
  console.log('❌ Unverified users:', unverifiedUsers.length);
  console.log('📋 Unverified users list:', unverifiedUsers);
  
  // Check current user session
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('👤 Current logged in user:', currentUser);
  
  // Check for users with verification tokens
  const usersWithTokens = allUsers.filter(user => user.emailVerificationToken);
  console.log('🎫 Users with verification tokens:', usersWithTokens.length);
  console.log('📋 Users with tokens:', usersWithTokens.map(u => ({
    email: u.email,
    token: u.emailVerificationToken?.substring(0, 10) + '...',
    expires: u.emailVerificationExpires
  })));
  
  return {
    totalUsers: allUsers.length,
    verifiedUsersCount: verifiedUsers.length,
    unverifiedUsersCount: unverifiedUsers.length,
    usersWithTokensCount: usersWithTokens.length,
    allUsers,
    verifiedUsersList: verifiedUsers,
    unverifiedUsersList: unverifiedUsers,
    currentUser
  };
};

/**
 * Add debug function to window for easy access in browser console
 */
if (typeof window !== 'undefined') {
  (window as any).debugUsers = debugUsers;
  console.log('🛠️ Debug utility available! Run debugUsers() in console to see user data');
}

// Fix the current user verification issue
const simpleUsers = JSON.parse(localStorage.getItem('talento_users') || '[]');
const userIndex = simpleUsers.findIndex(u => u.email === 'hopers.nft@gmail.com');
if (userIndex !== -1) {
  simpleUsers[userIndex].emailVerified = true;
  localStorage.setItem('talento_users', JSON.stringify(simpleUsers));
  console.log('✅ User verified in simple system:', simpleUsers[userIndex]);
} else {
  console.log('❌ User not found in simple system');
}

// Also fix in legacy system
const legacyUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
const legacyUserIndex = legacyUsers.findIndex(u => u.email === 'hopers.nft@gmail.com');
if (legacyUserIndex !== -1) {
  legacyUsers[legacyUserIndex].emailVerified = true;
  localStorage.setItem('allUsers', JSON.stringify(legacyUsers));
  console.log('✅ User verified in legacy system:', legacyUsers[legacyUserIndex]);
} else {
  console.log('❌ User not found in legacy system');
}

console.log('🎉 Current user verification fixed!');
console.log('📝 Now refresh the admin panel to see the user.');

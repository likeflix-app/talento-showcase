#!/usr/bin/env node

/**
 * Debug utility to check users in localStorage
 * Run this in browser console to see current users
 */

console.log('🔍 Current Users Debug');
console.log('====================');

// This would be run in browser console:
const debugUsers = () => {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  
  console.log('📊 Total users:', allUsers.length);
  console.log('👥 All users:');
  
  allUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.email})`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Email Verified: ${user.emailVerified}`);
    console.log(`   - Created: ${user.createdAt}`);
    if (user.emailVerificationToken) {
      console.log(`   - Verification Token: ${user.emailVerificationToken}`);
      console.log(`   - Token Expires: ${user.emailVerificationExpires}`);
    }
    console.log('---');
  });
  
  const verifiedUsers = allUsers.filter(user => user.emailVerified);
  const unverifiedUsers = allUsers.filter(user => !user.emailVerified);
  
  console.log(`✅ Verified users: ${verifiedUsers.length}`);
  console.log(`⏳ Unverified users: ${unverifiedUsers.length}`);
  
  return { allUsers, verifiedUsers, unverifiedUsers };
};

console.log('📝 To debug users in browser:');
console.log('1. Open your app in browser');
console.log('2. Press F12 to open Developer Tools');
console.log('3. Go to Console tab');
console.log('4. Copy and paste this function:');
console.log('');
console.log('const debugUsers = () => {');
console.log('  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");');
console.log('  console.log("📊 Total users:", allUsers.length);');
console.log('  allUsers.forEach((user, index) => {');
console.log('    console.log(`${index + 1}. ${user.name} (${user.email}) - Verified: ${user.emailVerified}`);');
console.log('  });');
console.log('  return allUsers;');
console.log('};');
console.log('debugUsers();');

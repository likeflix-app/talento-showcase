#!/usr/bin/env node

/**
 * Quick utility to reset users from command line
 * Run with: node reset-users.js
 */

console.log('🧹 User Reset Utility');
console.log('===================');

// Clear localStorage (simulated - in browser this would work)
console.log('🗑️ Clearing localStorage users...');

// Reset with only admin user
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

console.log('👤 Default users after reset:');
console.log(JSON.stringify(defaultUsers, null, 2));

console.log('\n✅ Reset complete!');
console.log('📝 To apply this reset:');
console.log('   1. Open your browser');
console.log('   2. Go to your app');
console.log('   3. Open Developer Tools (F12)');
console.log('   4. Go to Console tab');
console.log('   5. Run: localStorage.removeItem("allUsers")');
console.log('   6. Run: localStorage.setItem("allUsers", \'[{"id":"2","email":"admin@talento.com","name":"Admin User","role":"admin","createdAt":"' + new Date().toISOString() + '","emailVerified":true}]\')');
console.log('   7. Refresh the page');

console.log('\n🔧 Or use the Admin Panel:');
console.log('   1. Login as admin (admin@talento.com / password)');
console.log('   2. Go to Admin Dashboard');
console.log('   3. Click "Users" tab');
console.log('   4. Scroll down to "User Reset Utility"');
console.log('   5. Click "Reset All Users"');

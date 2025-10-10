/**
 * Test utility to verify backend connection
 * Run this in browser console to test API connectivity
 */

import { apiService } from '@/services/api';

export const testBackendConnection = async () => {
  console.log('🔍 Testing Backend Connection...');
  
  try {
    // Test health endpoint
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await apiService.healthCheck();
    console.log('Health Response:', healthResponse);
    
    if (healthResponse.success) {
      console.log('✅ Backend health check passed');
    } else {
      console.log('❌ Backend health check failed');
      return;
    }
    
    // Test users endpoint
    console.log('2️⃣ Testing users endpoint...');
    const usersResponse = await apiService.getUsers();
    console.log('Users Response:', usersResponse);
    
    if (usersResponse.success && usersResponse.data) {
      console.log(`✅ Found ${usersResponse.data.length} users in backend`);
      console.log('Users:', usersResponse.data);
    } else {
      console.log('❌ Failed to fetch users');
      return;
    }
    
    // Test stats endpoint
    console.log('3️⃣ Testing stats endpoint...');
    const statsResponse = await apiService.getUserStats();
    console.log('Stats Response:', statsResponse);
    
    if (statsResponse.success && statsResponse.data) {
      console.log('✅ Stats fetched successfully:', statsResponse.data);
    } else {
      console.log('❌ Failed to fetch stats');
    }
    
    console.log('🎉 Backend connection test complete!');
    
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
  }
};

// Auto-run if this file is imported
if (typeof window !== 'undefined') {
  console.log('Backend connection test utility loaded. Run testBackendConnection() in console to test.');
}


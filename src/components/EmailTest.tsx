import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { emailService } from '@/services/emailService';

const EmailTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testEmailService = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      console.log('🧪 Starting email service test...');
      
      // Check configuration
      const isConfigured = emailService.isConfigured();
      console.log('Email service configured:', isConfigured);
      
      // Test email sending
      const testResult = await emailService.testEmail();
      console.log('Test result:', testResult);
      
      setResult(`Test completed: ${testResult.success ? 'SUCCESS' : 'FAILED'} - ${testResult.message}`);
    } catch (error) {
      console.error('Test failed:', error);
      setResult(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testVerificationEmail = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      console.log('🧪 Testing verification email...');
      
      const verificationResult = await emailService.sendVerificationEmail(
        'test@example.com',
        'Test User',
        'https://example.com/verify?token=test123'
      );
      
      console.log('Verification email result:', verificationResult);
      setResult(`Verification email test: ${verificationResult.success ? 'SUCCESS' : 'FAILED'} - ${verificationResult.message}`);
    } catch (error) {
      console.error('Verification email test failed:', error);
      setResult(`Verification email test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Email Service Test</CardTitle>
        <CardDescription>
          Test the email service configuration and functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testEmailService} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : 'Test Email Service'}
          </Button>
          
          <Button 
            onClick={testVerificationEmail} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Testing...' : 'Test Verification Email'}
          </Button>
        </div>
        
        {result && (
          <div className={`p-3 rounded-md ${
            result.includes('SUCCESS') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <strong>Result:</strong> {result}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Open browser developer tools (F12)</li>
            <li>Go to Console tab</li>
            <li>Click "Test Email Service" button</li>
            <li>Check console logs for detailed information</li>
            <li>Look for configuration status and any error messages</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTest;

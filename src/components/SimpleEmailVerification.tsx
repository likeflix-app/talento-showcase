import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { simpleAuthService } from '@/services/simpleAuth';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SimpleEmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('🔍 Simple Verification - Token from URL:', token);
      
      if (!token) {
        setMessage('No verification token found');
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🚀 Simple Verification - Attempting verification...');
        const success = await simpleAuthService.verifyEmail(token);
        
        if (success) {
          setIsSuccess(true);
          setMessage('Email verified successfully! You can now login.');
          
          toast({
            title: '✅ Email Verified!',
            description: 'Your email has been verified successfully. You can now login.',
          });
          
          console.log('✅ Simple Verification - Email verification successful');
        } else {
          setIsSuccess(false);
          setMessage('Invalid or expired verification token');
          
          toast({
            title: '❌ Verification Failed',
            description: 'Invalid or expired verification token',
            variant: 'destructive',
          });
          
          console.log('❌ Simple Verification - Email verification failed');
        }
      } catch (error) {
        setIsSuccess(false);
        setMessage('An error occurred during verification');
        
        toast({
          title: '❌ Verification Error',
          description: 'An error occurred during verification',
          variant: 'destructive',
        });
        
        console.error('❌ Simple Verification - Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, toast]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToTest = () => {
    navigate('/simple-test');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600" />
              <p>Verifying your email...</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Success!</h3>
                <p className="text-gray-600">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleGoToTest} className="w-full">
                  Go to Test Page
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="w-full">
                  Go Home
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Verification Failed</h3>
                <p className="text-gray-600">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleGoToTest} variant="outline" className="w-full">
                  Go to Test Page
                </Button>
                <Button onClick={handleGoHome} className="w-full">
                  Go Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleEmailVerification;

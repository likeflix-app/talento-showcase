import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
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
        setMessage('Token di verifica non trovato');
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🚀 Simple Verification - Attempting verification...');
        const success = await authService.verifyEmail(token);
        
        if (success) {
          setIsSuccess(true);
          setMessage('Email verificata con successo! Ora puoi accedere.');
          
          toast({
            title: '✅ Email Verificata!',
            description: 'La tua email è stata verificata con successo. Ora puoi accedere.',
          });
          
          console.log('✅ Simple Verification - Email verification successful');
        } else {
          setIsSuccess(false);
          setMessage('Token di verifica non valido o scaduto');
          
          toast({
            title: '❌ Verifica Fallita',
            description: 'Token di verifica non valido o scaduto',
            variant: 'destructive',
          });
          
          console.log('❌ Simple Verification - Email verification failed');
        }
      } catch (error) {
        setIsSuccess(false);
        setMessage('Si è verificato un errore durante la verifica');
        
        toast({
          title: '❌ Errore di Verifica',
          description: 'Si è verificato un errore durante la verifica',
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

  const handleLogin = () => {
    navigate('/?auth=login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Verifica Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600" />
              <p>Verifica email in corso...</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Successo!</h3>
                <p className="text-gray-600">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleLogin} className="w-full">
                  Accesso
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="w-full">
                  Pagina Iniziale
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 mx-auto text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Verifica Fallita</h3>
                <p className="text-gray-600">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleLogin} variant="outline" className="w-full">
                  Accesso
                </Button>
                <Button onClick={handleGoHome} className="w-full">
                  Pagina Iniziale
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

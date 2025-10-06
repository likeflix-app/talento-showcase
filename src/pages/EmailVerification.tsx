import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { emailVerificationService } from '@/services/emailVerification';
import { useToast } from '@/hooks/use-toast';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage('Token di verifica non trovato');
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      try {
        const result = await emailVerificationService.verifyEmail(token);
        setIsSuccess(result.success);
        setMessage(result.message);
        
        if (result.success) {
          toast({
            title: 'Email verificata!',
            description: 'Il tuo account è stato verificato con successo.',
          });
        } else {
          toast({
            title: 'Verifica fallita',
            description: result.message,
            variant: 'destructive',
          });
        }
      } catch (error) {
        setIsSuccess(false);
        setMessage('Si è verificato un errore durante la verifica');
        toast({
          title: 'Errore',
          description: 'Si è verificato un errore durante la verifica.',
          variant: 'destructive',
        });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verifica Email
          </CardTitle>
          <CardDescription>
            Completiamo la verifica del tuo account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
              <p className="text-muted-foreground">
                Verifica in corso...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className={isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {isSuccess ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={isSuccess ? 'text-green-800' : 'text-red-800'}>
                  {message}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {isSuccess ? (
                  <>
                    <Button onClick={handleLogin} className="w-full">
                      Accedi al tuo account
                    </Button>
                    <Button onClick={handleGoHome} variant="outline" className="w-full">
                      Torna alla home
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleGoHome} className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Torna alla home
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Se il link è scaduto, puoi richiedere un nuovo link di verifica
                      dalla pagina di login.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;

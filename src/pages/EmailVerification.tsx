import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Mail, Sparkles } from 'lucide-react';
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
      console.log('🔍 Token from URL:', token);
      console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()));
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {isLoading ? (
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Verifica in corso...
                  </h2>
                  <p className="text-gray-600">
                    Stiamo verificando il tuo account, attendi un momento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isSuccess ? (
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    🎉 Perfetto!
                  </h2>
                  <p className="text-xl text-green-600 font-semibold mb-2">
                    Email verificata con successo
                  </p>
                  <p className="text-gray-600">
                    Il tuo account è ora attivo e puoi iniziare a prenotare le tue consulenze
                  </p>
                </div>
                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleLogin} 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Accedi al tuo account
                  </Button>
                  <Button 
                    onClick={handleGoHome} 
                    variant="outline" 
                    className="w-full border-2 border-gray-300 hover:border-gray-400 py-3 text-lg font-medium transition-all duration-200"
                  >
                    Torna alla home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <XCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-6 w-6 text-red-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Ops! Qualcosa è andato storto
                  </h2>
                  <Alert className="border-red-200 bg-red-50 text-left">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {message}
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleGoHome} 
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Torna alla home
                  </Button>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    💡 <strong>Suggerimento:</strong> Se il link è scaduto, puoi richiedere un nuovo link di verifica dalla pagina di login.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;

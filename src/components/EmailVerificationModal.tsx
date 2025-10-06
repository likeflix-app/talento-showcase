import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emailVerificationService } from '@/services/emailVerification';
import { User } from '@/types/auth';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onVerified: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  user,
  onVerified,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showManualVerification, setShowManualVerification] = useState(false);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const result = await emailVerificationService.resendVerificationEmail(user.id);
      if (result.success) {
        toast({
          title: 'Email inviato!',
          description: 'Controlla la tua casella di posta elettronica per il link di verifica.',
        });
      } else {
        toast({
          title: 'Errore',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'invio dell\'email.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerification = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci il codice di verifica.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await emailVerificationService.verifyEmail(verificationCode);
      if (result.success) {
        toast({
          title: 'Email verificata!',
          description: 'La tua email è stata verificata con successo.',
        });
        onVerified();
        onClose();
      } else {
        toast({
          title: 'Verifica fallita',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante la verifica.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Verifica Email
          </DialogTitle>
          <DialogDescription>
            Per completare la registrazione, devi verificare il tuo indirizzo email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Abbiamo inviato un link di verifica all'indirizzo <strong>{user.email}</strong>.
              Controlla la tua casella di posta e clicca sul link per verificare il tuo account.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Non hai ricevuto l'email? Controlla anche la cartella spam.
              </p>
              <Button
                onClick={handleResendEmail}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Invia nuovamente l'email
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Oppure</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowManualVerification(!showManualVerification)}
                className="w-full"
              >
                Inserisci manualmente il codice di verifica
              </Button>

              {showManualVerification && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Codice di verifica</Label>
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="Inserisci il codice di verifica"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleManualVerification}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifica in corso...
                      </>
                    ) : (
                      'Verifica'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Nota:</strong> In un'applicazione reale, riceveresti un'email con un link di verifica.
              Per questa demo, il link di verifica viene mostrato nella console del browser.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;

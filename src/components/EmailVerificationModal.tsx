import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { emailService } from '@/services/emailService';
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

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Generate new verification token
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Store verification token
      localStorage.setItem(`verification_${user.id}`, token);
      
      // Generate verification URL
      const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
      
      // Store user data temporarily for verification (same as in authService)
      localStorage.setItem(`pending_user_${user.id}`, JSON.stringify(user));
      
      // Send actual verification email
      const result = await emailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationUrl
      );
      
      if (result.success) {
        toast({
          title: 'Email inviato!',
          description: 'Controlla la tua casella di posta elettronica per il link di verifica.',
        });
      } else {
        toast({
          title: 'Errore',
          description: 'Si è verificato un errore durante l\'invio dell\'email.',
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

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
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

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <strong>Come verificare:</strong> Clicca semplicemente sul link che riceverai via email.
              Il link ti porterà direttamente alla pagina di verifica e completerà automaticamente il processo.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { bookingService } from '@/services/booking';
import { Loader2, Calendar, Clock, Euro } from 'lucide-react';
import { BookingRequest } from '@/types/booking';
import { formatPriceDisplay } from '@/lib/priceUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  talent: {
    name: string;
    category: string;
    price: string;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, talent }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '1',
    notes: '',
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const durationOptions = [
    { value: '1', label: '1 ora' },
    { value: '2', label: '2 ore' },
    { value: '3', label: '3 ore' },
    { value: '4', label: '4 ore' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const price = parseFloat(talent.price.replace('€', '').replace('/h', ''));
      const duration = parseInt(bookingData.duration);
      
      const bookingRequest: BookingRequest = {
        talentId: talent.name.toLowerCase().replace(/\s+/g, '-'),
        talentName: talent.name,
        talentCategory: talent.category,
        date: bookingData.date,
        time: bookingData.time,
        duration,
        price: price * duration,
        notes: bookingData.notes,
      };

      await bookingService.createBooking(user.id, bookingRequest);
      
      toast({
        title: 'Prenotazione creata!',
        description: `La tua consulenza con ${talent.name} è stata prenotata per il ${bookingData.date} alle ${bookingData.time}`,
      });

      onClose();
      setBookingData({ date: '', time: '', duration: '1', notes: '' });
    } catch (error) {
      toast({
        title: 'Errore nella prenotazione',
        description: error instanceof Error ? error.message : 'Si è verificato un errore',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum tomorrow
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Maximum 3 months from now
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Prenota Consulenza
          </DialogTitle>
          <div className="text-center text-muted-foreground">
            <p className="font-semibold text-lg">{talent.name}</p>
            <p className="text-sm">{talent.category}</p>
            <p className="text-sm font-medium text-primary">{talent.price}</p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                value={bookingData.date}
                onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                min={getMinDate()}
                max={getMaxDate()}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Orario</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select value={bookingData.time} onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Durata</Label>
            <Select value={bookingData.duration} onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona durata" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Textarea
              id="notes"
              placeholder="Descrivi le tue esigenze o obiettivi per questa consulenza..."
              value={bookingData.notes}
              onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
          
          {bookingData.date && bookingData.time && bookingData.duration && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Totale:</span>
                <span className="font-semibold flex items-center">
                  {isAuthenticated ? (
                    <>
                      <Euro className="h-4 w-4 mr-1" />
                      {(parseFloat(talent.price.replace('€', '').replace('/h', '')) * parseInt(bookingData.duration)).toFixed(2)}
                    </>
                  ) : (
                    '€€€'
                  )}
                </span>
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading || !bookingData.date || !bookingData.time}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Prenotando...
              </>
            ) : (
              'Conferma Prenotazione'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;

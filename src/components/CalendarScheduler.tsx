import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Calendar, Check, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStats } from '@/contexts/StatsContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createRequest, sendEmailNotification } from '@/services/request';
import { CartItem } from '@/contexts/CartContext';

interface CalendarSchedulerProps {
  items: CartItem[];
  phoneNumber: string;
  onBack: () => void;
  onTimeSlotSelect: (timeSlot: string) => void;
  selectedTimeSlot: string | null;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  datetime: string;
  available: boolean;
}

const CalendarScheduler: React.FC<CalendarSchedulerProps> = ({
  items,
  phoneNumber,
  onBack,
  onTimeSlotSelect,
  selectedTimeSlot,
}) => {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { triggerRefresh } = useStats();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(selectedTimeSlot);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateTimeSlots();
  }, []);

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    // Generate slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() + day);
      
      // Skip weekends for now (you can modify this)
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const dateStr = date.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      
      // Generate time slots from 9:00 to 17:00 (9 AM to 5 PM) Europe time
      for (let hour = 9; hour < 17; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const datetime = new Date(date);
        datetime.setHours(hour, 0, 0, 0);
        
        slots.push({
          id: `${dateStr}-${timeStr}`,
          date: dateStr,
          time: timeStr,
          datetime: datetime.toISOString(),
          available: Math.random() > 0.3, // Randomly make some slots unavailable
        });
      }
    }
    
    setTimeSlots(slots);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    onTimeSlotSelect(slotId);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user) {
      toast({
        title: "Errore",
        description: "Seleziona un orario e assicurati di essere autenticato.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const slot = timeSlots.find(s => s.id === selectedSlot);
      if (!slot) throw new Error('Slot not found');

      // Create request record
      const requestId = await createRequest({
        userId: user.id,
        talents: items,
        phoneNumber: phoneNumber || undefined,
        status: 'confirmed', // Directly confirm since they selected a time slot
        timeSlot: {
          date: slot.date,
          time: slot.time,
          datetime: slot.datetime
        }
      });

      // Send email notifications with time slot
      await sendEmailNotification(requestId, user, items, phoneNumber, slot);

      toast({
        title: "Prenotazione confermata!",
        description: `La tua consulenza è stata prenotata per ${slot.date} alle ${slot.time}.`,
      });

      // Clear cart after successful booking
      clearCart();
      
      // Trigger stats refresh to update dashboard
      triggerRefresh();
      
      // Navigate back to home
      navigate('/');
      
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la prenotazione.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna al riepilogo
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Scegli il tuo orario</h1>
          <p className="text-muted-foreground">
            Seleziona un orario disponibile per la tua consulenza gratuita
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot === slot.id ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => handleSlotSelect(slot.id)}
                        className={`flex flex-col items-center gap-1 h-16 ${
                          !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{slot.time}</span>
                        {!slot.available && (
                          <span className="text-xs text-muted-foreground">Occupato</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo Consulenza</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="font-medium mb-2">Talenti richiesti:</p>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{phoneNumber}</span>
                  </div>
                )}

                {selectedSlot && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Orario selezionato:</p>
                    <p className="text-sm text-muted-foreground">
                      {timeSlots.find(s => s.id === selectedSlot)?.date} alle{' '}
                      {timeSlots.find(s => s.id === selectedSlot)?.time}
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Durata: 30 minuti</p>
                  <p>• Modalità: Video chiamata o telefono</p>
                  <p>• Gratuita e senza impegno</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!selectedSlot || isLoading}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  {isLoading ? (
                    "Confermando..."
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Conferma Prenotazione
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Riceverai una email di conferma con tutti i dettagli
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarScheduler;

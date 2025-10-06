import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, Calendar, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CalendarScheduler from '@/components/CalendarScheduler';
import { formatPriceDisplay } from '@/lib/priceUtils';

const Checkout: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const handleQuantityChange = (talentId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(talentId);
    } else {
      updateQuantity(talentId, newQuantity);
    }
  };

  const handleRemoveItem = (talentId: string) => {
    removeFromCart(talentId);
    toast({
      title: "Rimosso",
      description: "Il talento è stato rimosso dalle tue richieste.",
    });
  };

  const handleBookConsultation = () => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per prenotare una consulenza.",
        variant: "destructive",
      });
      return;
    }

    setShowCalendar(true);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Nessuna richiesta</h2>
            <p className="text-muted-foreground mb-6">
              Non hai ancora richiesto nessun talento. Vai alla homepage per iniziare.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Sfoglia Talenti
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCalendar) {
    return (
      <CalendarScheduler
        items={items}
        phoneNumber={phoneNumber}
        onBack={() => setShowCalendar(false)}
        onTimeSlotSelect={handleTimeSlotSelect}
        selectedTimeSlot={selectedTimeSlot}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Riepilogo Richiesta</h1>
          <p className="text-center text-muted-foreground">
            Rivedi i talenti richiesti e prenota la tua consulenza
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Talents Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Talenti Richiesti ({getTotalItems()})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPriceDisplay(item.price, isAuthenticated)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo Consulenza</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Talenti richiesti:</span>
                  <span className="font-semibold">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Totale stimato:</span>
                  <span className="font-semibold">
                    {isAuthenticated ? `€${getTotalPrice().toFixed(2)}` : '€€€'}
                  </span>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>• Consulenza telefonica/video di 30 minuti</p>
                  <p>• Discussione personalizzata sui talenti richiesti</p>
                  <p>• Proposta di pacchetto su misura</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informazioni Contatto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Numero di telefono (opzionale)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+39 123 456 7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleBookConsultation}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Prenota Consulenza
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Scegli un orario disponibile per la tua consulenza gratuita
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

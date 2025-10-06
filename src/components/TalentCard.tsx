import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, LogIn, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Talent } from "@/types/talent";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { formatPriceDisplay } from "@/lib/priceUtils";

interface TalentCardProps extends Talent {}

const TalentCard = (talent: TalentCardProps) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRequestClick = () => {
    if (isAuthenticated) {
      addToCart(talent);
      toast({
        title: "Aggiunto al carrello",
        description: `${talent.name} è stato aggiunto alle tue richieste.`,
      });
      navigate('/checkout');
    } else {
      // Scroll to top to show login button
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <Card className="group relative overflow-hidden border border-border/50 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-card">
      <div className="aspect-square overflow-hidden">
        <img 
          src={talent.image} 
          alt={talent.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1 font-playfair">{talent.name}</h3>
            <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
              {talent.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold">{talent.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {talent.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">A partire da</p>
            <p className="text-2xl font-bold text-accent font-playfair">
              {formatPriceDisplay(talent.price, isAuthenticated)}
            </p>
          </div>
          
          <Button 
            size="sm"
            onClick={handleRequestClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            {isAuthenticated ? (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Richiedi
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login per Richiedere
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TalentCard;

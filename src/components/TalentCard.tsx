import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star } from "lucide-react";

interface TalentCardProps {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  rating: number;
}

const TalentCard = ({ name, category, price, image, description, rating }: TalentCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mx-2">
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">A partire da</p>
            <p className="text-2xl font-bold text-accent">{price}</p>
          </div>
          
          <Button 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Prenota
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TalentCard;

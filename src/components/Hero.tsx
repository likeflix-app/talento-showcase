import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToConsulenze = () => {
    document.getElementById('consulenze')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Incontra i Migliori Esperti
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Consulenze personalizzate con professionisti d'eccellenza in sport, cucina, cinema, moda e molto altro
        </p>
        <Button 
          size="lg" 
          onClick={scrollToConsulenze}
          className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Prenota una Consulenza
        </Button>
      </div>
    </section>
  );
};

export default Hero;

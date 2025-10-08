import { Button } from "@/components/ui/button";
import { Calendar, LogIn, User, Settings } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

const Hero = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToConsulenze = () => {
    document.getElementById('consulenze')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
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
        {/* Login/User Button - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          {isAuthenticated && user?.role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAuthClick}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            {isAuthenticated ? (
              <>
                <User className="mr-2 h-4 w-4" />
                {user?.name}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Accedi
              </>
            )}
          </Button>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          ISADORA Talent Agency
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Scegli tra i migliori talent oppure acquista un pacchetto e conquista i social con contenuti creati da veri professionisti del settore! Puoi anche richiedere la condivisione dei tuoi post nelle storie di Influencer e Celebrity.<br/><br/>Stima i costi e prenota una consulenza personalizzata.
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
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;

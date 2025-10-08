import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent">Consulenze Premium</h3>
            <p className="text-primary-foreground/80">
              Connetti con i migliori esperti italiani per consulenze personalizzate di qualità.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contatti</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@consulenze.it</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+39 02 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Milano, Italia</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Link Utili</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent transition-colors">Chi Siamo</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Come Funziona</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Termini e Condizioni</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 Consulenze Premium. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

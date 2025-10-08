import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent">ISADORA Talent Agency</h3>
            <p className="text-primary-foreground/80">
              Hai già un'idea di budget ma vuoi assistenza nella scelta? Un nostro consulente dedicato ti guiderà per ottenere il massimo risultato dalla tua campagna.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contatti</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>isadoracomunication@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="https://wa.me/41779223406?text=Salve,%20Sarei%20interessato/a%20a%20ricevere%20informazioni%20sui%20vostri%20prodotti/servizi" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  +41 77 922 34 06
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>C/o Wazz - Viale Castagnola 21A Lugano 6900</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Link Utili</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent transition-colors">Chi Siamo</a></li>
              <li><a href="https://www.instagram.com/isadoradvertising" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Isadora Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Termini e Condizioni</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 Isadora Agency. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

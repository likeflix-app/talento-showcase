import Hero from "@/components/Hero";
import TalentCarousel from "@/components/TalentCarousel";
import Footer from "@/components/Footer";

import talentSport1 from "@/assets/talent-sport-1.jpg";
import talentFood1 from "@/assets/talent-food-1.jpg";
import talentCinema1 from "@/assets/talent-cinema-1.jpg";
import talentModa1 from "@/assets/talent-moda-1.jpg";
import talentBusiness1 from "@/assets/talent-business-1.jpg";
import talentWellness1 from "@/assets/talent-wellness-1.jpg";
import packageBusinessWellness from "@/assets/package-business-wellness.jpg";
import packageFoodSport from "@/assets/package-food-sport.jpg";
import packageModaCinema from "@/assets/package-moda-cinema.jpg";
import packageComplete from "@/assets/package-complete.jpg";

const Index = () => {
  const premiumTalents = [
    {
      name: "Marco Rossi",
      category: "Sport & Fitness",
      price: "€150/h",
      image: talentSport1,
      description: "Ex atleta olimpico specializzato in preparazione atletica e coaching sportivo personalizzato.",
      rating: 4.9
    },
    {
      name: "Sofia Conti",
      category: "Alta Cucina",
      price: "€200/h",
      image: talentFood1,
      description: "Chef stellata con 15 anni di esperienza in cucina gourmet italiana e internazionale.",
      rating: 5.0
    },
    {
      name: "Luca Ferrari",
      category: "Cinema & Regia",
      price: "€180/h",
      image: talentCinema1,
      description: "Regista pluripremiato con esperienza in produzioni cinematografiche e documentari.",
      rating: 4.8
    },
    {
      name: "Giulia Marchetti",
      category: "Fashion & Style",
      price: "€175/h",
      image: talentModa1,
      description: "Fashion designer e stylist con esperienza nelle maggiori fashion week internazionali.",
      rating: 4.9
    },
    {
      name: "Alessandro Bianchi",
      category: "Business Strategy",
      price: "€250/h",
      image: talentBusiness1,
      description: "Consulente aziendale con track record di successi in startup e PMI italiane.",
      rating: 5.0
    },
    {
      name: "Elena Romano",
      category: "Wellness & Yoga",
      price: "€120/h",
      image: talentWellness1,
      description: "Insegnante certificata di yoga e meditazione, specializzata in tecniche di gestione dello stress.",
      rating: 4.9
    },
  ];

  const emergingTalents = [
    {
      name: "Davide Colombo",
      category: "Personal Training",
      price: "€80/h",
      image: talentSport1,
      description: "Personal trainer specializzato in allenamento funzionale e riabilitazione sportiva.",
      rating: 4.7
    },
    {
      name: "Francesca Verdi",
      category: "Pasticceria",
      price: "€90/h",
      image: talentFood1,
      description: "Pasticcera creativa specializzata in dolci moderni e cake design personalizzato.",
      rating: 4.8
    },
    {
      name: "Matteo Greco",
      category: "Fotografia Cinema",
      price: "€100/h",
      image: talentCinema1,
      description: "Direttore della fotografia emergente con occhio per la composizione artistica.",
      rating: 4.6
    },
    {
      name: "Valentina Ricci",
      category: "Personal Shopper",
      price: "€95/h",
      image: talentModa1,
      description: "Personal shopper e consulente d'immagine per privati e professionisti.",
      rating: 4.7
    },
    {
      name: "Simone Esposito",
      category: "Digital Marketing",
      price: "€110/h",
      image: talentBusiness1,
      description: "Esperto di marketing digitale e social media strategy per brand emergenti.",
      rating: 4.8
    },
    {
      name: "Chiara Fontana",
      category: "Nutrizione",
      price: "€85/h",
      image: talentWellness1,
      description: "Nutrizionista specializzata in alimentazione sportiva e piani personalizzati.",
      rating: 4.7
    },
  ];

  const optimizedPackages = [
    {
      name: "Pacchetto Business & Benessere",
      category: "Business + Wellness",
      price: "€890",
      image: packageBusinessWellness,
      description: "3 sessioni di consulenza aziendale + 3 sessioni di yoga e meditazione. Equilibrio perfetto tra successo professionale e benessere personale.",
      rating: 5.0
    },
    {
      name: "Pacchetto Lifestyle Salutare",
      category: "Food + Sport",
      price: "€750",
      image: packageFoodSport,
      description: "4 sessioni di coaching nutrizionale + 4 sessioni di personal training. Il tuo percorso completo verso uno stile di vita sano.",
      rating: 4.9
    },
    {
      name: "Pacchetto Immagine Totale",
      category: "Moda + Cinema",
      price: "€820",
      image: packageModaCinema,
      description: "2 sessioni di consulenza styling + servizio fotografico professionale. Crea la tua immagine distintiva con i migliori esperti.",
      rating: 4.9
    },
    {
      name: "Pacchetto Trasformazione Completa",
      category: "Multi-disciplinare",
      price: "€1.450",
      image: packageComplete,
      description: "Il pacchetto premium che combina business, wellness, food e sport. 10 sessioni per una trasformazione a 360 gradi della tua vita.",
      rating: 5.0
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <div id="consulenze" className="space-y-2">
        <TalentCarousel 
          title="Esperti Premium" 
          talents={premiumTalents}
        />
        
        <TalentCarousel 
          title="Talenti Emergenti" 
          talents={emergingTalents}
        />

        <TalentCarousel 
          title="Pacchetti Ottimizzati" 
          talents={optimizedPackages}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;

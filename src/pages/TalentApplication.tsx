import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Italian provinces and Swiss Canton Ticino districts
const ITALIAN_PROVINCES = [
  "Agrigento",
  "Alessandria",
  "Ancona",
  "Arezzo",
  "Ascoli Piceno",
  "Asti",
  "Avellino",
  "Bari",
  "Barletta-Andria-Trani",
  "Belluno",
  "Benevento",
  "Bergamo",
  "Biella",
  "Bologna",
  "Bolzano/Bozen",
  "Brindisi",
  "Cagliari",
  "Caltanissetta",
  "Campobasso",
  "Caserta",
  "Catania",
  "Catanzaro",
  "Chieti",
  "Como",
  "Cosenza",
  "Cremona",
  "Crotone",
  "Cuneo",
  "Enna",
  "Ferrara",
  "Firenze",
  "Foggia",
  "Forlì-Cesena",
  "Frosinone",
  "Genova",
  "Gorizia",
  "Grosseto",
  "Imperia",
  "Isernia",
  "La Spezia",
  "L'Aquila",
  "Latina",
  "Lecce",
  "Lecco",
  "Livorno",
  "Lodi",
  "Lucca",
  "Macerata",
  "Mantova",
  "Massa-Carrara",
  "Matera",
  "Messina",
  "Milano",
  "Modena",
  "Monza e della Brianza",
  "Napoli",
  "Novara",
  "Nuoro",
  "Oristano",
  "Padova",
  "Palermo",
  "Parma",
  "Pavia",
  "Perugia",
  "Pesaro e Urbino",
  "Pescara",
  "Piacenza",
  "Pisa",
  "Pistoia",
  "Pordenone",
  "Potenza",
  "Prato",
  "Ragusa",
  "Ravenna",
  "Reggio Calabria",
  "Reggio Emilia",
  "Rieti",
  "Rimini",
  "Roma",
  "Rovigo",
  "Salerno",
  "Sassari",
  "Savona",
  "Siena",
  "Siracusa",
  "Sondrio",
  "Sud Sardegna",
  "Taranto",
  "Terni",
  "Trapani",
  "Trento",
  "Treviso",
  "Trieste",
  "Torino",
  "Udine",
  "Varese",
  "Venezia",
  "Verbano-Cusio-Ossola",
  "Vercelli",
  "Verona",
  "Vibo Valentia",
  "Vicenza",
  "Viterbo"
];

const SWISS_TICINO_DISTRICTS = [
  "Bellinzona",
  "Blenio",
  "Leventina",
  "Locarno",
  "Lugano",
  "Mendrisio",
  "Riviera",
  "Vallemaggia"
];

interface TalentFormData {
  // Step 1: Personal Information
  email: string;
  bio: string;
  fullName: string;
  birthYear: string;
  city: string;
  nickname: string;
  phone: string;

  // Step 2: Profile
  socialChannels: string[];
  socialLinks: string;
  mediaKit: File[];
  contentCategories: string[];
  availableForProducts: string;
  shippingAddress: string;
  availableForReels: string;
  availableNext3Months: string;
  availabilityPeriod: string;
  collaboratedAgencies: string;
  agenciesList: string;
  collaboratedBrands: string;
  brandsList: string;

  // Step 3: Fiscal Information
  hasVAT: string;
  paymentMethod: string[];
  termsAccepted: boolean;
}

const TalentApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TalentFormData>({
    email: user?.email || "",
    bio: "",
    fullName: "",
    birthYear: "",
    city: "",
    nickname: "",
    phone: "",
    socialChannels: [],
    socialLinks: "",
    mediaKit: [],
    contentCategories: [],
    availableForProducts: "",
    shippingAddress: "",
    availableForReels: "",
    availableNext3Months: "",
    availabilityPeriod: "",
    collaboratedAgencies: "",
    agenciesList: "",
    collaboratedBrands: "",
    brandsList: "",
    hasVAT: "",
    paymentMethod: [],
    termsAccepted: false,
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const socialChannelOptions = [
    "Facebook",
    "Instagram",
    "Linkedin",
    "Thread",
    "TikTok",
    "Twitch",
    "X",
    "Whatsapp (Storie)",
    "YouTube",
    "Altro"
  ];

  const contentCategoryOptions = [
    "Arte",
    "Beauty",
    "Benessere",
    "Comicità",
    "Educazione",
    "Fitness",
    "Food",
    "Gaming",
    "Genitorialità",
    "Lifestyle",
    "Medicina Estetica",
    "Moda",
    "Musica",
    "Tech",
    "Viaggi",
    "Altro"
  ];

  const paymentMethodOptions = [
    "Bonifico",
    "PayPal",
    "Crypto",
    "Buoni Amazon",
    "Altro"
  ];

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.fullName || !formData.birthYear || !formData.phone) {
        toast({
          title: "Campi obbligatori mancanti",
          description: "Completa tutti i campi obbligatori (*) prima di procedere.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 2) {
      if (
        formData.socialChannels.length === 0 ||
        !formData.socialLinks ||
        formData.contentCategories.length === 0 ||
        !formData.availableForProducts ||
        !formData.availableForReels ||
        !formData.availableNext3Months ||
        !formData.collaboratedAgencies ||
        !formData.collaboratedBrands
      ) {
        toast({
          title: "Campi obbligatori mancanti",
          description: "Completa tutti i campi obbligatori (*) prima di procedere.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      toast({
        title: "Termini e condizioni",
        description: "Devi accettare tutti i termini e condizioni per procedere.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Submit form data to backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Candidatura inviata!",
      description: "Grazie per aver inviato la tua candidatura. Ti contatteremo presto!",
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleCheckboxChange = (category: string, value: boolean, field: keyof TalentFormData) => {
    const currentArray = formData[field] as string[];
    if (value) {
      setFormData({ ...formData, [field]: [...currentArray, category] });
    } else {
      setFormData({ ...formData, [field]: currentArray.filter((item) => item !== category) });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10); // Max 10 files
      setFormData({ ...formData, mediaKit: files });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Home
          </Button>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Diventa un Talento Isadora
          </h1>
          <p className="text-muted-foreground">
            Compila il form in 3 semplici step per candidarti come talento
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} di {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Informazioni Personali"}
              {currentStep === 2 && "Il Tuo Profilo"}
              {currentStep === 3 && "Informazioni Fiscali e Termini"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Fornisci le tue informazioni di base"}
              {currentStep === 2 && "Raccontaci di più sul tuo profilo e contenuti"}
              {currentStep === 3 && "Completa con le informazioni fiscali e accetta i termini"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fullName">
                      Nome e Cognome <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthYear">
                      Anno di Nascita <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="birthYear"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Città di Domicilio</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona la tua provincia o distretto" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground bg-muted/50">
                          🇮🇹 Province Italiane
                        </div>
                        {ITALIAN_PROVINCES.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground bg-muted/50 mt-2">
                          🇨🇭 Canton Ticino (Svizzera)
                        </div>
                        {SWISS_TICINO_DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Se vivi in più città, seleziona quella principale
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      placeholder="Indicare un Nickname se utilizzato principalmente"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      Numero di telefono <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Prefisso + Numero"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Inserisci una breve descrizione che vorresti venga inserita nel post di Isadora dedicato a te"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Profile */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">
                      Canali principali Social <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {socialChannelOptions.map((channel) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <Checkbox
                            id={`social-${channel}`}
                            checked={formData.socialChannels.includes(channel)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(channel, checked as boolean, "socialChannels")
                            }
                          />
                          <label
                            htmlFor={`social-${channel}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {channel}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="socialLinks">
                      Link ai tuoi canali <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="socialLinks"
                      value={formData.socialLinks}
                      onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                      placeholder="Inserire @nomeprofilo per ogni social oppure un LinkTree"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="mediaKit">
                      Il tuo Media Kit <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="mediaKit"
                      type="file"
                      multiple
                      accept="image/*,video/*,.ppt,.pptx"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Inserire almeno 3 tue foto vetrina. Max 10 file, 10MB per file.
                    </p>
                    {formData.mediaKit.length > 0 && (
                      <p className="text-sm text-primary mt-2">
                        {formData.mediaKit.length} file selezionati
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-3 block">
                      Categorie dei Contenuti <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {contentCategoryOptions.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={formData.contentCategories.includes(category)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(category, checked as boolean, "contentCategories")
                            }
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>
                      Sei disponibile a ricevere prodotti a domicilio per eventuali contenuti?{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="products-si"
                          name="availableForProducts"
                          value="Si"
                          checked={formData.availableForProducts === "Si"}
                          onChange={(e) =>
                            setFormData({ ...formData, availableForProducts: e.target.value })
                          }
                          required
                        />
                        <Label htmlFor="products-si" className="font-normal">
                          Sì
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="products-no"
                          name="availableForProducts"
                          value="No"
                          checked={formData.availableForProducts === "No"}
                          onChange={(e) =>
                            setFormData({ ...formData, availableForProducts: e.target.value })
                          }
                        />
                        <Label htmlFor="products-no" className="font-normal">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  {formData.availableForProducts === "Si" && (
                    <div>
                      <Label htmlFor="shippingAddress">Indirizzo di Spedizione Completo</Label>
                      <Textarea
                        id="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        rows={2}
                      />
                    </div>
                  )}

                  <div>
                    <Label>
                      Sei disponibile a fare dei Reel parlati?{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Per brand che desiderano la presentazione di un prodotto/servizio
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="reels-si"
                          name="availableForReels"
                          value="Si"
                          checked={formData.availableForReels === "Si"}
                          onChange={(e) =>
                            setFormData({ ...formData, availableForReels: e.target.value })
                          }
                          required
                        />
                        <Label htmlFor="reels-si" className="font-normal">
                          Sì
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="reels-no"
                          name="availableForReels"
                          value="No"
                          checked={formData.availableForReels === "No"}
                          onChange={(e) =>
                            setFormData({ ...formData, availableForReels: e.target.value })
                          }
                        />
                        <Label htmlFor="reels-no" className="font-normal">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>
                      Sei disponibile a creare contenuti nei prossimi 3 mesi?{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="available-si"
                          name="availableNext3Months"
                          value="Si"
                          checked={formData.availableNext3Months === "Si"}
                          onChange={(e) =>
                            setFormData({ ...formData, availableNext3Months: e.target.value })
                          }
                          required
                        />
                        <Label htmlFor="available-si" className="font-normal">
                          Sì
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="available-no"
                          name="availableNext3Months"
                          value="No"
                          checked={formData.availableNext3Months === "No"}
                          onChange={(e) =>
                            setFormData({ ...formData, availableNext3Months: e.target.value })
                          }
                        />
                        <Label htmlFor="available-no" className="font-normal">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  {formData.availableNext3Months === "Si" && (
                    <div>
                      <Label htmlFor="availabilityPeriod">Periodo di disponibilità</Label>
                      <Input
                        id="availabilityPeriod"
                        value={formData.availabilityPeriod}
                        onChange={(e) => setFormData({ ...formData, availabilityPeriod: e.target.value })}
                        placeholder="Indica il periodo da quando saresti disponibile"
                      />
                    </div>
                  )}

                  <div>
                    <Label>
                      Hai già collaborato/stai collaborando con altre agenzie?{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="agencies-si"
                          name="collaboratedAgencies"
                          value="Si"
                          checked={formData.collaboratedAgencies === "Si"}
                          onChange={(e) =>
                            setFormData({ ...formData, collaboratedAgencies: e.target.value })
                          }
                          required
                        />
                        <Label htmlFor="agencies-si" className="font-normal">
                          Sì
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="agencies-no"
                          name="collaboratedAgencies"
                          value="No"
                          checked={formData.collaboratedAgencies === "No"}
                          onChange={(e) =>
                            setFormData({ ...formData, collaboratedAgencies: e.target.value })
                          }
                        />
                        <Label htmlFor="agencies-no" className="font-normal">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  {formData.collaboratedAgencies === "Si" && (
                    <div>
                      <Label htmlFor="agenciesList">Con quali agenzie?</Label>
                      <Input
                        id="agenciesList"
                        value={formData.agenciesList}
                        onChange={(e) => setFormData({ ...formData, agenciesList: e.target.value })}
                        placeholder="Indica quelle principali"
                      />
                    </div>
                  )}

                  <div>
                    <Label>
                      Hai già collaborato/stai collaborando con Brand?{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="brands-si"
                          name="collaboratedBrands"
                          value="Si"
                          checked={formData.collaboratedBrands === "Si"}
                          onChange={(e) =>
                            setFormData({ ...formData, collaboratedBrands: e.target.value })
                          }
                          required
                        />
                        <Label htmlFor="brands-si" className="font-normal">
                          Sì
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="brands-no"
                          name="collaboratedBrands"
                          value="No"
                          checked={formData.collaboratedBrands === "No"}
                          onChange={(e) =>
                            setFormData({ ...formData, collaboratedBrands: e.target.value })
                          }
                        />
                        <Label htmlFor="brands-no" className="font-normal">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  {formData.collaboratedBrands === "Si" && (
                    <div>
                      <Label htmlFor="brandsList">Con quali Brand?</Label>
                      <Input
                        id="brandsList"
                        value={formData.brandsList}
                        onChange={(e) => setFormData({ ...formData, brandsList: e.target.value })}
                        placeholder="Indica quelli principali"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Fiscal Information and Terms */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Se risponderai Sì riceverai una mail per la richiesta dei dati fiscali
                    </p>
                  </div>

                  <div>
                    <Label>Hai Partita IVA o puoi Emettere Ricevuta?</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="vat-si"
                          name="hasVAT"
                          value="Si"
                          checked={formData.hasVAT === "Si"}
                          onChange={(e) => setFormData({ ...formData, hasVAT: e.target.value })}
                        />
                        <Label htmlFor="vat-si" className="font-normal">
                          Sì
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="vat-no"
                          name="hasVAT"
                          value="No"
                          checked={formData.hasVAT === "No"}
                          onChange={(e) => setFormData({ ...formData, hasVAT: e.target.value })}
                        />
                        <Label htmlFor="vat-no" className="font-normal">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Modalità di incasso</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethodOptions.map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <Checkbox
                            id={`payment-${method}`}
                            checked={formData.paymentMethod.includes(method)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(method, checked as boolean, "paymentMethod")
                            }
                          />
                          <label
                            htmlFor={`payment-${method}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {method}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <Label className="mb-4 block text-lg font-semibold">
                      Termini e Condizioni <span className="text-destructive">*</span>
                    </Label>
                    
                    <div className="bg-secondary/30 p-6 rounded-lg max-h-96 overflow-y-auto space-y-4 text-sm mb-4">
                      <p className="font-medium">Accettando dichiari di:</p>
                      
                      <ul className="space-y-3 list-disc list-inside">
                        <li>Autorizzi l'utilizzo dei contenuti foto/video pubblici e quelli creati in collaborazione con l'agenzia e i brand partner, per finalità promozionali, editoriali e digitali.</li>
                        
                        <li>Ti impegni a comunicare tempestivamente all'agenzia l'eventuale avvio di collaborazioni con altre agenzie o strutture terze.</li>
                        
                        <li>Ti assumi la piena responsabilità dei contenuti da te pubblicati e ti impegni a non condividere contenuti diffamatori, discriminatori, offensivi o che violino copyright.</li>
                        
                        <li>Manlevi l'agenzia e i brand coinvolti da qualsiasi responsabilità legale derivante da contenuti pubblicati in autonomia.</li>
                        
                        <li>Ti impegni a non divulgare informazioni riservate, documenti, strategie, brief o materiali interni ricevuti da parte dell'agenzia o dei brand.</li>
                        
                        <li>Autorizzi il trattamento dei tuoi dati personali secondo la normativa vigente (Regolamento UE 2016/679 – GDPR).</li>
                        
                        <li>Comprendi che alcuni contenuti non prevedono compenso economico diretto, ma possono consistere in invii prodotto, servizi e/o consumazioni.</li>
                        
                        <li>Ti impegni a rispettare le linee guida creative, le deadline e i brief forniti dall'agenzia per ogni singola attivazione o progetto.</li>
                        
                        <li>Riconosci che tutti i contenuti prodotti nell'ambito della collaborazione possono essere utilizzati dall'agenzia e dal brand partner.</li>
                        
                        <li>Accetti che l'agenzia si riserva il diritto di interrompere la collaborazione in qualsiasi momento qualora vengano pubblicati contenuti non conformi.</li>
                      </ul>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg bg-background">
                      <Checkbox
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, termsAccepted: checked as boolean })
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor="termsAccepted"
                        className="text-sm font-medium leading-relaxed cursor-pointer"
                      >
                        Ho letto e accetto tutti i termini e condizioni sopra elencati{" "}
                        <span className="text-destructive">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Indietro
                </Button>

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Avanti
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!formData.termsAccepted}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Invia Candidatura
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentApplication;


import { Talent, TalentFormData } from '@/types/talent';

// Mock talents database
const mockTalents: Talent[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    category: 'Sport & Fitness',
    price: '€150/h',
    image: '/src/assets/talent-sport-1.jpg',
    description: 'Ex atleta olimpico specializzato in preparazione atletica e coaching sportivo personalizzato.',
    rating: 4.9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sofia Conti',
    category: 'Alta Cucina',
    price: '€200/h',
    image: '/src/assets/talent-food-1.jpg',
    description: 'Chef stellata con 15 anni di esperienza in cucina gourmet italiana e internazionale.',
    rating: 5.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Luca Ferrari',
    category: 'Cinema & Regia',
    price: '€180/h',
    image: '/src/assets/talent-cinema-1.jpg',
    description: 'Regista pluripremiato con esperienza in produzioni cinematografiche e documentari.',
    rating: 4.8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Giulia Marchetti',
    category: 'Fashion & Style',
    price: '€175/h',
    image: '/src/assets/talent-moda-1.jpg',
    description: 'Fashion designer e stylist con esperienza nelle maggiori fashion week internazionali.',
    rating: 4.9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Alessandro Bianchi',
    category: 'Business Strategy',
    price: '€250/h',
    image: '/src/assets/talent-business-1.jpg',
    description: 'Consulente aziendale con track record di successi in startup e PMI italiane.',
    rating: 5.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Elena Romano',
    category: 'Wellness & Yoga',
    price: '€120/h',
    image: '/src/assets/talent-wellness-1.jpg',
    description: 'Insegnante certificata di yoga e meditazione, specializzata in tecniche di gestione dello stress.',
    rating: 4.9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class TalentService {
  private static instance: TalentService;

  static getInstance(): TalentService {
    if (!TalentService.instance) {
      TalentService.instance = new TalentService();
    }
    return TalentService.instance;
  }

  async getAllTalents(): Promise<Talent[]> {
    await delay(500);
    return [...mockTalents];
  }

  async getTalentById(id: string): Promise<Talent | null> {
    await delay(300);
    return mockTalents.find(talent => talent.id === id) || null;
  }

  async createTalent(talentData: TalentFormData): Promise<Talent> {
    await delay(1000);
    
    const newTalent: Talent = {
      id: Date.now().toString(),
      ...talentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTalents.push(newTalent);
    return newTalent;
  }

  async updateTalent(id: string, talentData: Partial<TalentFormData>): Promise<Talent> {
    await delay(1000);
    
    const talentIndex = mockTalents.findIndex(talent => talent.id === id);
    if (talentIndex === -1) {
      throw new Error('Talent not found');
    }

    mockTalents[talentIndex] = {
      ...mockTalents[talentIndex],
      ...talentData,
      updatedAt: new Date().toISOString(),
    };

    return mockTalents[talentIndex];
  }

  async deleteTalent(id: string): Promise<void> {
    await delay(1000);
    
    const talentIndex = mockTalents.findIndex(talent => talent.id === id);
    if (talentIndex === -1) {
      throw new Error('Talent not found');
    }

    mockTalents.splice(talentIndex, 1);
  }

  async toggleTalentStatus(id: string): Promise<Talent> {
    await delay(500);
    
    const talent = mockTalents.find(t => t.id === id);
    if (!talent) {
      throw new Error('Talent not found');
    }

    talent.isActive = !talent.isActive;
    talent.updatedAt = new Date().toISOString();
    
    return talent;
  }

  async getActiveTalentsCount(): Promise<number> {
    await delay(300);
    return mockTalents.filter(talent => talent.isActive).length;
  }
}

export const talentService = TalentService.getInstance();

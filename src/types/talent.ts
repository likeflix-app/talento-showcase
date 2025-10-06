export interface Talent {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TalentFormData {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  rating: number;
  isActive: boolean;
}

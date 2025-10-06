export interface Booking {
  id: string;
  userId: string;
  talentId: string;
  talentName: string;
  talentCategory: string;
  date: string;
  time: string;
  duration: number; // in hours
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface BookingRequest {
  talentId: string;
  talentName: string;
  talentCategory: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  notes?: string;
}

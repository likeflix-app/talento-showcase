import { Talent } from './talent';

export interface Request {
  id: string;
  userId: string;
  talents: Talent[];
  phoneNumber?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  timeSlot?: {
    date: string;
    time: string;
    datetime: string;
  };
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CreateRequestData {
  userId: string;
  talents: Talent[];
  phoneNumber?: string;
  status: 'pending' | 'confirmed';
  timeSlot?: {
    date: string;
    time: string;
    datetime: string;
  };
}

export interface EmailNotificationData {
  requestId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  talents: Talent[];
  phoneNumber?: string;
}

import { Booking, BookingRequest } from '@/types/booking';

// Mock bookings database
const mockBookings: Booking[] = [];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BookingService {
  private static instance: BookingService;

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async createBooking(userId: string, bookingRequest: BookingRequest): Promise<Booking> {
    await delay(1000); // Simulate API call

    const newBooking: Booking = {
      id: Date.now().toString(),
      userId,
      ...bookingRequest,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    mockBookings.push(newBooking);
    return newBooking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    await delay(500); // Simulate API call
    if (userId === 'all') {
      return mockBookings; // Return all bookings for admin
    }
    return mockBookings.filter(booking => booking.userId === userId);
  }

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    await delay(500); // Simulate API call
    
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = status;
    return booking;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await delay(500); // Simulate API call
    
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = 'cancelled';
  }
}

export const bookingService = BookingService.getInstance();

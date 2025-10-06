import { Request, CreateRequestData, EmailNotificationData } from '@/types/request';
import { emailService } from './emailService';

// Mock requests database
const mockRequests: Request[] = [];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class RequestService {
  private static instance: RequestService;

  static getInstance(): RequestService {
    if (!RequestService.instance) {
      RequestService.instance = new RequestService();
    }
    return RequestService.instance;
  }

  async createRequest(requestData: CreateRequestData): Promise<string> {
    await delay(1000); // Simulate API call

    const requestId = `REQ-${Date.now()}`;
    const newRequest: Request = {
      id: requestId,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockRequests.push(newRequest);
    return requestId;
  }

  async getRequest(requestId: string): Promise<Request | null> {
    await delay(500); // Simulate API call
    return mockRequests.find(req => req.id === requestId) || null;
  }

  async getUserRequests(userId: string): Promise<Request[]> {
    await delay(500); // Simulate API call
    return mockRequests.filter(req => req.userId === userId);
  }

  async getAllRequests(): Promise<Request[]> {
    await delay(500); // Simulate API call
    return mockRequests;
  }

  async updateRequestStatus(requestId: string, status: Request['status'], timeSlot?: Request['timeSlot']): Promise<Request> {
    await delay(500); // Simulate API call
    
    const request = mockRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    request.status = status;
    request.updatedAt = new Date().toISOString();
    if (timeSlot) {
      request.timeSlot = timeSlot;
    }

    return request;
  }

  async cancelRequest(requestId: string): Promise<void> {
    await delay(500); // Simulate API call
    
    const request = mockRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    request.status = 'cancelled';
    request.updatedAt = new Date().toISOString();
  }
}

export const requestService = RequestService.getInstance();

// Email notification functions
export const sendEmailNotification = async (
  requestId: string,
  user: { id: string; name: string; email: string },
  talents: any[],
  phoneNumber?: string,
  timeSlot?: { date: string; time: string; datetime: string }
): Promise<void> => {
  await delay(1000); // Simulate API call

  try {
    // Send real emails using the email service
    const emailResult = await emailService.sendBookingConfirmation(
      requestId,
      user,
      talents,
      phoneNumber,
      timeSlot
    );

    // Fallback to console logging if email service fails
    if (!emailResult.success) {
      console.log('📧 Email notification (fallback):');
      console.log('Request ID:', requestId);
      console.log('User:', user);
      console.log('Talents:', talents);
      console.log('Phone:', phoneNumber);
      console.log('Time Slot:', timeSlot);
      console.log('---');
    }
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Fallback to console logging
    console.log('📧 Email notification (error fallback):');
    console.log('Request ID:', requestId);
    console.log('User:', user);
    console.log('Talents:', talents);
    console.log('Phone:', phoneNumber);
    console.log('Time Slot:', timeSlot);
    console.log('---');
  }
};

const generateEmailTemplate = (
  requestId: string,
  user: { name: string; email: string },
  talents: any[],
  phoneNumber?: string,
  timeSlot?: { date: string; time: string; datetime: string }
): string => {
  const talentList = talents.map(talent => 
    `<li>${talent.name} (${talent.category}) - ${talent.price}</li>`
  ).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        Prenotazione Consulenza ID#${requestId}
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Dettagli Cliente</h3>
        <p><strong>Nome:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        ${phoneNumber ? `<p><strong>Telefono:</strong> ${phoneNumber}</p>` : ''}
      </div>
      
      ${timeSlot ? `
        <div style="background-color: #fff3cd; padding: 20px; border: 1px solid #ffeaa7; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">📅 Dettagli Consulenza</h3>
          <p style="margin: 5px 0;"><strong>Data:</strong> ${timeSlot.date}</p>
          <p style="margin: 5px 0;"><strong>Orario:</strong> ${timeSlot.time}</p>
          <p style="margin: 5px 0;"><strong>Durata:</strong> 30 minuti</p>
          <p style="margin: 5px 0;"><strong>Modalità:</strong> Video chiamata o telefono</p>
        </div>
      ` : ''}
      
      <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Talenti Richiesti</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${talentList}
        </ul>
      </div>
      
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #2d5a2d;">
          <strong>✅ Prenotazione confermata!</strong> La consulenza è stata prenotata con successo. 
          ${timeSlot ? `Ti contatteremo il ${timeSlot.date} alle ${timeSlot.time}.` : 'Ti contatteremo presto per concordare un orario.'}
        </p>
      </div>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Questa email è stata generata automaticamente dal sistema Talento Showcase.
      </p>
    </div>
  `;
};

// Export the createRequest function for use in components
export const createRequest = async (requestData: CreateRequestData): Promise<string> => {
  return requestService.createRequest(requestData);
};

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const BUSINESS_EMAIL = import.meta.env.VITE_BUSINESS_EMAIL || 'likeflix.app@gmail.com';

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailData {
  to: string[];
  subject: string;
  html: string;
  from_name?: string;
  from_email?: string;
  reply_to?: string;
}

export interface EmailTemplateData {
  to_email?: string;
  to_name?: string;
  subject?: string;
  message?: string;
  from_name?: string;
  reply_to?: string;
  // Standard EmailJS template variables
  user_email?: string;
  user_name?: string;
  user_subject?: string;
  user_message?: string;
  // Additional fields
  [key: string]: string | undefined;
}

export class EmailService {
  private static instance: EmailService;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send email using EmailJS
   */
  async sendEmail(emailData: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      // Debug: Log configuration status
      console.log('🔧 EmailJS Configuration Check:');
      console.log('Service ID:', EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing');
      console.log('Template ID:', EMAILJS_TEMPLATE_ID ? '✅ Set' : '❌ Missing');
      console.log('Public Key:', EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
      console.log('Business Email:', BUSINESS_EMAIL);
      
      // Check if EmailJS is configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.warn('❌ EmailJS not configured. Falling back to console logging.');
        this.logEmail(emailData);
        return {
          success: false,
          message: 'Email service not configured'
        };
      }

      // Prepare template data for EmailJS with multiple parameter formats
      const templateData: EmailTemplateData = {
        // Standard EmailJS variables
        to_email: emailData.to[0],
        to_name: this.extractNameFromEmail(emailData.to[0]),
        subject: emailData.subject,
        message: emailData.html,
        from_name: emailData.from_name || 'Talento Showcase',
        reply_to: emailData.reply_to || BUSINESS_EMAIL,
        
        // Alternative variable names (in case template uses different names)
        user_email: emailData.to[0],
        user_name: this.extractNameFromEmail(emailData.to[0]),
        user_subject: emailData.subject,
        user_message: emailData.html,
        
        // Additional common variables
        email: emailData.to[0],
        name: this.extractNameFromEmail(emailData.to[0]),
        html_message: emailData.html,
        text_message: this.stripHtml(emailData.html)
      };

      // Debug: Log template data
      console.log('📧 Sending email with template data:', templateData);
      
      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateData
      );

      console.log('✅ Email sent successfully:', result);
      return {
        success: true,
        message: 'Email sent successfully'
      };

    } catch (error) {
      console.error('Failed to send email:', error);
      // Fallback to console logging
      this.logEmail(emailData);
      return {
        success: false,
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Send multiple emails (for notifications to multiple recipients)
   */
  async sendMultipleEmails(emails: EmailData[]): Promise<{ success: boolean; message: string; results: any[] }> {
    const results = [];
    let allSuccessful = true;

    for (const emailData of emails) {
      const result = await this.sendEmail(emailData);
      results.push(result);
      if (!result.success) {
        allSuccessful = false;
      }
    }

    return {
      success: allSuccessful,
      message: allSuccessful ? 'All emails sent successfully' : 'Some emails failed to send',
      results
    };
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(
    to: string,
    userName: string,
    verificationUrl: string
  ): Promise<{ success: boolean; message: string }> {
    const emailData: EmailData = {
      to: [to],
      subject: 'Verifica il tuo account - Talento Showcase',
      html: this.generateVerificationEmailTemplate(userName, verificationUrl),
      from_name: 'Talento Showcase'
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(
    requestId: string,
    user: { id: string; name: string; email: string },
    talents: any[],
    phoneNumber?: string,
    timeSlot?: { date: string; time: string; datetime: string }
  ): Promise<{ success: boolean; message: string }> {
    // Send to user
    const userEmailData: EmailData = {
      to: [user.email],
      subject: `Prenotazione Consulenza ID#${requestId} - Talento Showcase`,
      html: this.generateBookingEmailTemplate(requestId, user, talents, phoneNumber, timeSlot),
      from_name: 'Talento Showcase'
    };

    // Send to business
    const businessEmailData: EmailData = {
      to: [BUSINESS_EMAIL],
      subject: `Nuova Prenotazione ID#${requestId} - ${user.name}`,
      html: this.generateBusinessNotificationTemplate(requestId, user, talents, phoneNumber, timeSlot),
      from_name: 'Talento Showcase'
    };

    // Send both emails
    const results = await this.sendMultipleEmails([userEmailData, businessEmailData]);
    
    return {
      success: results.success,
      message: results.success ? 'Booking confirmation sent' : 'Failed to send booking confirmation'
    };
  }

  /**
   * Generate verification email template
   */
  private generateVerificationEmailTemplate(userName: string, verificationUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Verifica il tuo account
        </h2>
        
        <p>Ciao ${userName},</p>
        
        <p>Grazie per esserti registrato su Talento Showcase! Per completare la registrazione, clicca sul pulsante qui sotto per verificare il tuo indirizzo email:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verifica Email
          </a>
        </div>
        
        <p>Se il pulsante non funziona, puoi anche copiare e incollare questo link nel tuo browser:</p>
        <p style="word-break: break-all; color: #666; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
          ${verificationUrl}
        </p>
        
        <p>Il link di verifica scadrà tra 24 ore.</p>
        
        <p>Se non hai creato un account su Talento Showcase, puoi ignorare questa email.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Questa email è stata inviata automaticamente da Talento Showcase.
        </p>
      </div>
    `;
  }

  /**
   * Generate booking email template
   */
  private generateBookingEmailTemplate(
    requestId: string,
    user: { name: string; email: string },
    talents: any[],
    phoneNumber?: string,
    timeSlot?: { date: string; time: string; datetime: string }
  ): string {
    const talentList = talents.map(talent => 
      `<li style="margin: 5px 0;">${talent.name} (${talent.category}) - €${talent.price}</li>`
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
          </p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Questa email è stata generata automaticamente dal sistema Talento Showcase.
        </p>
      </div>
    `;
  }

  /**
   * Generate business notification template
   */
  private generateBusinessNotificationTemplate(
    requestId: string,
    user: { name: string; email: string },
    talents: any[],
    phoneNumber?: string,
    timeSlot?: { date: string; time: string; datetime: string }
  ): string {
    const talentList = talents.map(talent => 
      `<li style="margin: 5px 0;">${talent.name} (${talent.category}) - €${talent.price}</li>`
    ).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
          🔔 NUOVA PRENOTAZIONE ID#${requestId}
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc3545; margin-top: 0;">Dettagli Cliente</h3>
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
          <h3 style="color: #dc3545; margin-top: 0;">Talenti Richiesti</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${talentList}
          </ul>
        </div>
        
        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0c5460;">
            <strong>📋 Azione Richiesta:</strong> Contatta il cliente per confermare la consulenza.
          </p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Notifica automatica dal sistema Talento Showcase.
        </p>
      </div>
    `;
  }

  /**
   * Extract name from email address
   */
  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];
    return localPart.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Strip HTML tags from string
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Fallback method to log email data when service is not available
   */
  private logEmail(emailData: EmailData): void {
    console.log('📧 Email would be sent:');
    console.log('To:', emailData.to.join(', '));
    console.log('Subject:', emailData.subject);
    console.log('Content:', emailData.html);
    console.log('---');
  }

  /**
   * Check if email service is properly configured
   */
  isConfigured(): boolean {
    return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
  }

  /**
   * Test email functionality
   */
  async testEmail(): Promise<{ success: boolean; message: string }> {
    console.log('🧪 Testing email service...');
    
    const testEmailData: EmailData = {
      to: ['test@example.com'],
      subject: 'Test Email from Talento Showcase',
      html: '<h1>Test Email</h1><p>This is a test email to verify the service is working.</p>',
      from_name: 'Talento Showcase Test'
    };

    return await this.sendEmail(testEmailData);
  }
}

export const emailService = EmailService.getInstance();

// Talent Application Email Service
import { emailService } from './emailService';
import { TalentApplication } from './talentApplication';

export interface EmailTemplates {
  applicationSubmitted: {
    subject: string;
    html: string;
  };
  applicationApproved: {
    subject: string;
    html: string;
  };
  applicationRejected: {
    subject: string;
    html: string;
  };
}

// Italian email templates for talent applications
const TALENT_EMAIL_TEMPLATES: EmailTemplates = {
  applicationSubmitted: {
    subject: "Candidatura Talento Isadora - Ricevuta ✅",
    html: `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Candidatura Ricevuta</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #8B4513; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #8B4513; margin-bottom: 10px; }
          .tagline { color: #666; font-size: 16px; }
          .content { padding: 20px 0; }
          .highlight { background-color: #FFF8DC; padding: 15px; border-left: 4px solid #8B4513; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background-color: #8B4513; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px; color: #666; font-size: 14px; }
          .social-links { margin: 20px 0; }
          .social-links a { color: #8B4513; text-decoration: none; margin: 0 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌟 Isadora Agency</div>
            <div class="tagline">Talento Showcase</div>
          </div>
          
          <div class="content">
            <h2>Ciao {{fullName}}! 👋</h2>
            
            <p>Grazie per aver inviato la tua candidatura per diventare un talento Isadora! La tua richiesta è stata ricevuta e registrata con successo.</p>
            
            <div class="highlight">
              <strong>📋 Dettagli della tua candidatura:</strong><br>
              • Nome: {{fullName}}<br>
              • Email: {{email}}<br>
              • Città: {{city}}<br>
              • Categorie: {{contentCategories}}<br>
              • Canali Social: {{socialChannels}}<br>
              • Data invio: {{submissionDate}}
            </div>
            
            <h3>🔄 Cosa succede ora?</h3>
            <p>Il nostro team esaminerà attentamente la tua candidatura e tutti i materiali che hai condiviso. Il processo di revisione può richiedere alcuni giorni lavorativi.</p>
            
            <ul>
              <li><strong>📸 Media Kit:</strong> Abbiamo ricevuto le tue {{photoCount}} foto vetrina</li>
              <li><strong>📱 Profilo Social:</strong> Verificheremo i tuoi canali e follower</li>
              <li><strong>🎯 Contenuti:</strong> Valuteremo la qualità e l'allineamento con i nostri brand partner</li>
              <li><strong>🤝 Disponibilità:</strong> Confirmeremo la tua disponibilità per le collaborazioni</li>
            </ul>
            
            <div class="highlight">
              <strong>⏰ Tempi di risposta:</strong><br>
              Ti contatteremo entro 5-7 giorni lavorativi per comunicarti l'esito della tua candidatura.
            </div>
            
            <h3>📞 Hai domande?</h3>
            <p>Se hai bisogno di informazioni aggiuntive o vuoi aggiornare qualche dato della tua candidatura, non esitare a contattarci:</p>
            
            <p>
              📧 Email: <a href="mailto:isadoracomunication@gmail.com">isadoracomunication@gmail.com</a><br>
              📱 WhatsApp: <a href="https://wa.me/41779223406">+41 77 922 34 06</a>
            </p>
            
            <p>Grazie ancora per la tua fiducia in Isadora Agency. Non vediamo l'ora di poterti conoscere meglio!</p>
            
            <p>Un caro saluto,<br>
            <strong>Il Team Isadora Agency</strong></p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="https://www.instagram.com/isadoradvertising/">Instagram</a> |
              <a href="mailto:isadoracomunication@gmail.com">Contatti</a>
            </div>
            <p>© 2025 Isadora Agency. Tutti i diritti riservati.<br>
            C/o Wazz - Viale Castagnola 21A Lugano 6900</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  applicationApproved: {
    subject: "🎉 Benvenuto nel Team Talenti Isadora!",
    html: `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Candidatura Approvata</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #228B22; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #228B22; margin-bottom: 10px; }
          .tagline { color: #666; font-size: 16px; }
          .content { padding: 20px 0; }
          .highlight { background-color: #F0FFF0; padding: 15px; border-left: 4px solid #228B22; margin: 20px 0; border-radius: 5px; }
          .success-badge { background-color: #228B22; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; font-weight: bold; }
          .button { display: inline-block; background-color: #228B22; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌟 Isadora Agency</div>
            <div class="tagline">Talento Showcase</div>
          </div>
          
          <div class="content">
            <div style="text-align: center;">
              <div class="success-badge">🎉 CANDIDATURA APPROVATA! 🎉</div>
            </div>
            
            <h2>Ciao {{fullName}}! 🎊</h2>
            
            <p><strong>Fantastico!</strong> Siamo entusiasti di comunicarti che la tua candidatura è stata <strong>APPROVATA</strong> e sei ora ufficialmente parte del nostro network di talenti Isadora!</p>
            
            <div class="highlight">
              <strong>🎯 Cosa significa questo per te:</strong><br>
              • Sei ora nel nostro database talenti verificati<br>
              • Potrai ricevere proposte di collaborazione<br>
              • Avrai accesso a progetti esclusivi con brand premium<br>
              • Farai parte di una community di creator di talento
            </div>
            
            <h3>🚀 Prossimi Passi</h3>
            <p>Il nostro team ti contatterà presto per:</p>
            <ul>
              <li>📋 Completare il setup del tuo profilo talento</li>
              <li>🤝 Condividere le prime opportunità di collaborazione</li>
              <li>📞 Programmare una call di benvenuto</li>
              <li>📖 Fornirti le linee guida per le collaborazioni</li>
            </ul>
            
            <h3>💼 Categorie Approvate</h3>
            <p>Le tue categorie di contenuto approvate sono: <strong>{{contentCategories}}</strong></p>
            
            <h3>📱 Contatti Diretti</h3>
            <p>Per qualsiasi domanda o per iniziare subito le collaborazioni:</p>
            <p>
              📧 Email: <a href="mailto:isadoracomunication@gmail.com">isadoracomunication@gmail.com</a><br>
              📱 WhatsApp: <a href="https://wa.me/41779223406">+41 77 922 34 06</a>
            </p>
            
            <div class="highlight">
              <strong>🎉 Benvenuto nel team Isadora!</strong><br>
              Non vediamo l'ora di lavorare insieme e di vedere i fantastici contenuti che creerai!
            </div>
            
            <p>Un caro saluto e ancora complimenti!<br>
            <strong>Il Team Isadora Agency</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2025 Isadora Agency. Tutti i diritti riservati.<br>
            C/o Wazz - Viale Castagnola 21A Lugano 6900</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  applicationRejected: {
    subject: "Candidatura Talento Isadora - Comunicazione",
    html: `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Candidatura - Comunicazione</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #8B4513; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #8B4513; margin-bottom: 10px; }
          .tagline { color: #666; font-size: 16px; }
          .content { padding: 20px 0; }
          .highlight { background-color: #FFF8DC; padding: 15px; border-left: 4px solid #8B4513; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌟 Isadora Agency</div>
            <div class="tagline">Talento Showcase</div>
          </div>
          
          <div class="content">
            <h2>Ciao {{fullName}},</h2>
            
            <p>Grazie per aver inviato la tua candidatura per diventare un talento Isadora. Dopo un'attenta valutazione, purtroppo non possiamo procedere con la tua richiesta al momento.</p>
            
            <div class="highlight">
              <strong>📋 La tua candidatura è stata valutata per:</strong><br>
              • Qualità dei contenuti<br>
              • Allineamento con i nostri brand partner<br>
              • Crescita del profilo social<br>
              • Disponibilità per collaborazioni
            </div>
            
            <h3>🔄 Possibili Motivi</h3>
            <p>Le candidature possono non essere approvate per diversi motivi, tra cui:</p>
            <ul>
              <li>Numero di follower ancora in crescita</li>
              <li>Allineamento delle categorie con le nostre esigenze attuali</li>
              <li>Disponibilità limitata per le collaborazioni</li>
              <li>Qualità del media kit o dei contenuti</li>
            </ul>
            
            <h3>💡 Consigli per il Futuro</h3>
            <p>Ti incoraggiamo a:</p>
            <ul>
              <li>Continuare a crescere la tua community</li>
              <li>Creare contenuti di alta qualità</li>
              <li>Mantenere un profilo coerente</li>
              <li>Riproporre la candidatura in futuro</li>
            </ul>
            
            <div class="highlight">
              <strong>🔄 Riprova in futuro!</strong><br>
              Puoi sempre inviare una nuova candidatura quando senti di essere pronto. Il nostro team è sempre alla ricerca di nuovi talenti!
            </div>
            
            <h3>📞 Hai domande?</h3>
            <p>Se desideri maggiori informazioni sui motivi della decisione o hai domande, non esitare a contattarci:</p>
            
            <p>
              📧 Email: <a href="mailto:isadoracomunication@gmail.com">isadoracomunication@gmail.com</a><br>
              📱 WhatsApp: <a href="https://wa.me/41779223406">+41 77 922 34 06</a>
            </p>
            
            <p>Grazie ancora per l'interesse dimostrato verso Isadora Agency e ti auguriamo il meglio per i tuoi progetti futuri!</p>
            
            <p>Cordiali saluti,<br>
            <strong>Il Team Isadora Agency</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2025 Isadora Agency. Tutti i diritti riservati.<br>
            C/o Wazz - Viale Castagnola 21A Lugano 6900</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

class TalentEmailService {
  // Replace template variables with actual data
  private replaceTemplateVariables(template: string, data: any): string {
    let result = template;
    
    // Replace all {{variable}} with actual values
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, data[key] || '');
    });
    
    return result;
  }

  // Send application submitted confirmation email
  async sendApplicationSubmittedEmail(application: TalentApplication): Promise<boolean> {
    try {
      const template = TALENT_EMAIL_TEMPLATES.applicationSubmitted;
      
      const emailData = {
        fullName: application.fullName,
        email: application.email,
        city: application.city,
        contentCategories: application.contentCategories.join(', '),
        socialChannels: application.socialChannels.join(', '),
        photoCount: application.mediaKitUrls.length,
        submissionDate: new Date(application.createdAt).toLocaleDateString('it-IT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const htmlContent = this.replaceTemplateVariables(template.html, emailData);
      
      const result = await emailService.sendEmail({
        to: application.email,
        subject: template.subject,
        html: htmlContent,
        text: `Ciao ${application.fullName}! La tua candidatura talento è stata ricevuta con successo. Ti contatteremo entro 5-7 giorni lavorativi.`
      });

      return result.success;
    } catch (error) {
      console.error('Error sending application submitted email:', error);
      return false;
    }
  }

  // Send application approved email
  async sendApplicationApprovedEmail(application: TalentApplication): Promise<boolean> {
    try {
      const template = TALENT_EMAIL_TEMPLATES.applicationApproved;
      
      const emailData = {
        fullName: application.fullName,
        email: application.email,
        contentCategories: application.contentCategories.join(', ')
      };

      const htmlContent = this.replaceTemplateVariables(template.html, emailData);
      
      const result = await emailService.sendEmail({
        to: application.email,
        subject: template.subject,
        html: htmlContent,
        text: `Ciao ${application.fullName}! Congratulazioni! La tua candidatura è stata approvata e sei ora parte del team talenti Isadora!`
      });

      return result.success;
    } catch (error) {
      console.error('Error sending application approved email:', error);
      return false;
    }
  }

  // Send application rejected email
  async sendApplicationRejectedEmail(application: TalentApplication): Promise<boolean> {
    try {
      const template = TALENT_EMAIL_TEMPLATES.applicationRejected;
      
      const emailData = {
        fullName: application.fullName,
        email: application.email
      };

      const htmlContent = this.replaceTemplateVariables(template.html, emailData);
      
      const result = await emailService.sendEmail({
        to: application.email,
        subject: template.subject,
        html: htmlContent,
        text: `Ciao ${application.fullName}, grazie per la tua candidatura. Purtroppo non possiamo procedere al momento, ma ti incoraggiamo a riprovare in futuro.`
      });

      return result.success;
    } catch (error) {
      console.error('Error sending application rejected email:', error);
      return false;
    }
  }

  // Send admin notification email
  async sendAdminNotificationEmail(application: TalentApplication): Promise<boolean> {
    try {
      const result = await emailService.sendEmail({
        to: 'isadoracomunication@gmail.com',
        subject: `🚨 Nuova Candidatura Talento - ${application.fullName}`,
        html: `
          <h2>Nuova Candidatura Talento</h2>
          <p><strong>Nome:</strong> ${application.fullName}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Città:</strong> ${application.city}</p>
          <p><strong>Età:</strong> ${new Date().getFullYear() - application.birthYear} anni</p>
          <p><strong>Canali Social:</strong> ${application.socialChannels.join(', ')}</p>
          <p><strong>Categorie:</strong> ${application.contentCategories.join(', ')}</p>
          <p><strong>Disponibile per prodotti:</strong> ${application.availableForProducts}</p>
          <p><strong>Disponibile per Reel:</strong> ${application.availableForReels}</p>
          <p><strong>Media Kit:</strong> ${application.mediaKitUrls.length} foto</p>
          <p><strong>Data candidatura:</strong> ${new Date(application.createdAt).toLocaleDateString('it-IT')}</p>
          
          <p><a href="https://your-admin-panel-url/admin" style="background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vai al Pannello Admin</a></p>
        `,
        text: `Nuova candidatura talento ricevuta da ${application.fullName} (${application.email})`
      });

      return result.success;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      return false;
    }
  }
}

export const talentEmailService = new TalentEmailService();
export { TALENT_EMAIL_TEMPLATES };

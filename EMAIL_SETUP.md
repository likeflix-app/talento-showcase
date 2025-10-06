# Email Service Setup Guide

This guide will help you set up real email sending for your Talento Showcase application using EmailJS.

## 🚀 Quick Setup with EmailJS

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Set Up Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your Gmail account
5. Note down your **Service ID**

### Step 3: Create Email Templates
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Create a template with these variables:
   - `{{to_email}}` - Recipient email
   - `{{to_name}}` - Recipient name
   - `{{subject}}` - Email subject
   - `{{message}}` - HTML email content
   - `{{from_name}}` - Sender name
   - `{{reply_to}}` - Reply-to email

4. Note down your **Template ID**

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key**

### Step 5: Configure Environment Variables
1. Copy `env.example` to `.env` in your project root
2. Fill in your EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_BUSINESS_EMAIL=likeflix.app@gmail.com
```

### Step 6: Test the Setup
1. Start your development server: `npm run dev`
2. Try registering a new user or making a booking
3. Check your email for verification/confirmation emails

## 📧 Email Templates

The application sends two types of emails:

### 1. Email Verification
- **Trigger**: When a new user registers
- **Recipients**: New user
- **Content**: Verification link with 24-hour expiration

### 2. Booking Confirmation
- **Trigger**: When a user books a consultation
- **Recipients**: 
  - User (confirmation email)
  - Business email (`likeflix.app@gmail.com`) (notification email)
- **Content**: Booking details, talent information, time slot

## 🔧 Fallback Behavior

If EmailJS is not configured or fails:
- Emails will be logged to the browser console
- The application will continue to work normally
- Users will see appropriate success/error messages

## 🛠 Alternative Email Services

If you prefer other email services:

### SendGrid
- Replace EmailJS with SendGrid API
- Update `src/services/emailService.ts` to use SendGrid SDK

### AWS SES
- Use AWS SES for production-grade email delivery
- Requires backend implementation

### Gmail SMTP
- Direct SMTP integration (requires backend)
- Good for development/testing

## 🐛 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check your environment variables are correct
   - Verify EmailJS service is active
   - Check browser console for errors

2. **Template variables not working**
   - Ensure template variables match exactly (case-sensitive)
   - Check EmailJS template configuration

3. **Gmail connection issues**
   - Verify Gmail account permissions
   - Check if 2FA is enabled (may require app password)

### Debug Mode
- Check browser console for email logs
- Look for "📧 Email would be sent:" messages
- Verify environment variables are loaded

## 📊 Email Analytics

EmailJS provides basic analytics:
- Email delivery status
- Open rates (if tracking enabled)
- Bounce rates

Access analytics in your EmailJS dashboard.

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- EmailJS public key is safe to expose in frontend code
- Consider rate limiting for production use

## 📞 Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Community: [https://github.com/emailjs-com/emailjs-sdk](https://github.com/emailjs-com/emailjs-sdk)

---

**Ready to send real emails!** 🎉

Once configured, your Talento Showcase application will send actual emails instead of just logging them to the console.

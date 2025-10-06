# EmailJS Template Setup Guide

## 🚨 **URGENT: Fix Your EmailJS Template**

Based on the 422 error, your EmailJS template is not configured correctly. Here's how to fix it:

## 📧 **Required Template Variables**

Your EmailJS template **MUST** include these variables (use ANY of these names):

### **Essential Variables:**
- `{{to_email}}` or `{{user_email}}` or `{{email}}` - Recipient email
- `{{to_name}}` or `{{user_name}}` or `{{name}}` - Recipient name  
- `{{subject}}` or `{{user_subject}}` - Email subject
- `{{message}}` or `{{user_message}}` or `{{html_message}}` - Email content

### **Optional Variables:**
- `{{from_name}}` - Sender name
- `{{reply_to}}` - Reply-to email

## 🔧 **How to Fix Your Template**

### Step 1: Go to EmailJS Dashboard
1. Login to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Go to **Email Templates**
3. Find your template with ID: `template_ykfa7k8`

### Step 2: Update Template Content
Replace your template content with this:

```html
Subject: {{subject}}

Dear {{to_name}},

{{message}}

Best regards,
{{from_name}}
```

### Step 3: Save the Template
Click **Save** to update your template.

## 🧪 **Quick Test Template**

For testing, use this simple template:

```html
Subject: Test Email

Hello {{to_name}},

{{message}}

From: {{from_name}}
Reply to: {{reply_to}}
```

## 🔍 **Verify Template Variables**

In your EmailJS template editor, make sure you see:
- `{{to_email}}` (or `{{user_email}}` or `{{email}}`)
- `{{to_name}}` (or `{{user_name}}` or `{{name}}`)
- `{{subject}}` (or `{{user_subject}}`)
- `{{message}}` (or `{{user_message}}` or `{{html_message}}`)

## ⚠️ **Common Mistakes**

1. **Missing variables** - Template must have at least `to_email`, `subject`, and `message`
2. **Wrong variable names** - Must match exactly (case-sensitive)
3. **Empty template** - Template cannot be completely empty
4. **Invalid HTML** - Keep HTML simple for testing

## 🚀 **After Fixing Template**

1. **Save your template** in EmailJS dashboard
2. **Refresh your browser** (hard refresh: Ctrl+F5 or Cmd+Shift+R)
3. **Test again** using the Email Test component
4. **Check console** for success messages

## 📞 **Still Having Issues?**

If you still get 422 errors after fixing the template:

1. **Try a completely new template** in EmailJS
2. **Use the simplest possible template** (just text, no HTML)
3. **Check EmailJS service status** - make sure Gmail connection is active
4. **Verify your EmailJS account** is not suspended or limited

---

**The 422 error means your template is missing required variables. Fix the template and emails will work!** 🎯

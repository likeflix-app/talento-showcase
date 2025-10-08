# Supabase Backend Setup Guide

This guide will help you set up Supabase as your backend database for permanent user storage.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `talento-showcase`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" → "API"
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy your `.env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update your `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to "SQL Editor"
2. Copy the contents of `supabase-schema.sql` 
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- ✅ Users table with proper structure
- ✅ Indexes for performance
- ✅ Default admin and demo users
- ✅ Row Level Security policies
- ✅ Proper permissions

## Step 5: Switch to Supabase Services

To use the new Supabase backend, you need to update your imports:

### Option A: Quick Switch (Recommended)
Update these files to use Supabase services:

1. **src/services/auth.ts** - Replace with `authSupabase.ts`
2. **src/services/user.ts** - Replace with `userSupabase.ts`  
3. **src/services/emailVerification.ts** - Replace with `emailVerificationSupabase.ts`

### Option B: Gradual Migration
You can keep both services and switch gradually by updating imports in:
- `src/contexts/AuthContext.tsx`
- `src/components/admin/UsersManagement.tsx`
- `src/pages/EmailVerification.tsx`

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test user registration:
   - Register a new user
   - Check Supabase dashboard → "Table Editor" → "users" to see the new user
   - Verify email and check if `email_verified` becomes `true`

3. Test admin panel:
   - Login as admin (`admin@talento.com` / `password`)
   - Check if verified users appear in the admin panel

## Benefits of Supabase Backend

✅ **Permanent Storage**: Users are stored in PostgreSQL database
✅ **Email Verification**: Built-in token management
✅ **Real-time Updates**: Live updates to admin panel
✅ **Security**: Row Level Security (RLS) policies
✅ **Scalability**: Handles thousands of users
✅ **Backup**: Automatic backups and point-in-time recovery

## Troubleshooting

### Users not appearing in admin panel?
- Check if users have `email_verified = true` in Supabase
- Verify Row Level Security policies are working
- Check browser console for errors

### Login not working?
- Ensure user exists in Supabase `users` table
- Check if `email_verified = true`
- Verify environment variables are correct

### Email verification failing?
- Check if verification tokens are being generated
- Verify email service configuration
- Check Supabase logs for errors

## Next Steps

Once Supabase is working:
1. Set up email templates in Supabase Auth
2. Configure custom SMTP for production emails
3. Add user analytics and monitoring
4. Set up automated backups
5. Configure rate limiting and security rules

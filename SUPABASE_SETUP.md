# Supabase Authentication Setup Guide

## Quick Fix: Email Authentication (Works Immediately)

Email authentication is enabled by default in Supabase, so you can test the app right away using the email sign-in form.

### Test the App Now:

1. Go to `http://localhost:3000/signin`
2. Scroll down to "Or continue with email"
3. Enter any email and password
4. Click "Sign up" to create an account
5. Check your email for confirmation link

## OAuth Setup (For Google/GitHub Sign-in)

### 1. Enable OAuth Providers in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `fpkxqbzaxpihkeysmhsv`
3. Navigate to **Authentication → Providers**

### 2. Configure Google OAuth

#### Step 1: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add redirect URIs:
   ```
   https://fpkxqbzaxpihkeysmhsv.supabase.co/auth/v1/callback
   http://localhost:3000
   ```
7. Save and copy **Client ID** and **Client Secret**

#### Step 2: Configure in Supabase

1. In Supabase Dashboard → Authentication → Providers
2. Find **Google** and toggle it ON
3. Paste your **Client ID** and **Client Secret**
4. Click **Save**

### 3. Configure GitHub OAuth

#### Step 1: Create GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/applications/new)
2. Fill in:
   - **Application name**: AI Study Companion
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `https://fpkxqbzaxpihkeysmhsv.supabase.co/auth/v1/callback`
3. Click **Register application**
4. Copy **Client ID** and generate **Client Secret**

#### Step 2: Configure in Supabase

1. In Supabase Dashboard → Authentication → Providers
2. Find **GitHub** and toggle it ON
3. Paste your **Client ID** and **Client Secret**
4. Click **Save**

### 4. Update Site URL Configuration

1. In Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/dashboard
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```

## Email Settings (Optional)

### Enable Email Confirmations:

1. Go to Authentication → Settings
2. Enable **"Confirm email"** if you want email verification
3. Disable it for faster testing during development

### Custom Email Templates:

1. Go to Authentication → Email Templates
2. Customize the confirmation and recovery email templates

## Database Setup (Optional)

### Create User Profiles Table:

```sql
-- Run this in Supabase SQL Editor
create table profiles (
  id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  primary key (id)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policy
create policy "Users can view own profile"
on profiles for select
using ( auth.uid() = id );

create policy "Users can update own profile"
on profiles for update
using ( auth.uid() = id );
```

## Testing Checklist

- [ ] Email sign-up works
- [ ] Email sign-in works
- [ ] Email confirmation (if enabled)
- [ ] Google OAuth (after setup)
- [ ] GitHub OAuth (after setup)
- [ ] Redirect to dashboard after sign-in
- [ ] Sign-out functionality
- [ ] Protected routes work

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URL"**

   - Check Site URL and Redirect URLs in Supabase settings
   - Ensure URLs match exactly (no trailing slashes)

2. **"Provider not enabled"**

   - Make sure OAuth provider is toggled ON in Supabase
   - Double-check Client ID and Secret are correct

3. **Email not received**

   - Check spam folder
   - Verify email settings in Authentication → Settings
   - For development, consider disabling email confirmation

4. **CORS errors**
   - Ensure Site URL is set correctly
   - Check that your domain is allowed in Supabase settings

## Current Setup Status

✅ **Email Authentication**: Ready to use
⏳ **Google OAuth**: Needs setup
⏳ **GitHub OAuth**: Needs setup
✅ **App Interface**: Updated with error handling
✅ **Fallback**: Email auth available if OAuth fails

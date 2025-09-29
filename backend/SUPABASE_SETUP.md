# 🚀 Supabase Configuration Guide

## ✅ Current Configuration

Your Supabase project is partially configured:

- **Project URL**: `https://fpkxqbzaxpihkeysmhsv.supabase.co`
- **Anon Key**: Already configured in `.env`

## 🔑 Missing Credentials

You need to get these two additional credentials from your Supabase dashboard:

### 1. Service Role Key

- **Purpose**: Backend API authentication with full database access
- **Location**: [Project API Settings](https://supabase.com/dashboard/project/fpkxqbzaxpihkeysmhsv/settings/api)
- **Look for**: "service_role" key (NOT the anon key)
- **Format**: Starts with `eyJ...` and is longer than anon key

### 2. JWT Secret

- **Purpose**: Verifying JWT tokens from authenticated users
- **Location**: [Project API Settings](https://supabase.com/dashboard/project/fpkxqbzaxpihkeysmhsv/settings/api)
- **Look for**: "JWT Secret" in the JWT Settings section
- **Format**: Long alphanumeric string

## 📝 Update Configuration

Once you have both credentials, update your `backend/.env` file:

```bash
# Replace these two lines:
SUPABASE_SERVICE_KEY=your_actual_service_role_key_here
SUPABASE_JWT_SECRET=your_actual_jwt_secret_here
```

## 🗄️ Database Setup

After updating the environment variables:

1. **Open Supabase SQL Editor**: [New Query](https://supabase.com/dashboard/project/fpkxqbzaxpihkeysmhsv/sql/new)

2. **Run the Database Schema**: Copy and paste the entire contents of `backend/schema.sql`

3. **Execute**: Click "Run" to create the `study_plans` table with proper security

## 🧪 Test Your Setup

1. **Install Dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the Server**:

   ```bash
   ./start.sh
   ```

3. **Verify Configuration**:

   - Visit: http://localhost:8000/api/config
   - Should show all Supabase connections as `true`

4. **Test API Endpoints**:
   - Visit: http://localhost:8000/docs
   - Try the interactive API documentation

## 🔐 Security Notes

- **Service Role Key**: Keep this secret! It has full database access
- **JWT Secret**: Used to verify user authentication tokens
- **Anon Key**: Safe for frontend use, limited permissions
- **Environment File**: Never commit `.env` to version control

## 🎯 Quick Links

- **Dashboard**: https://supabase.com/dashboard/project/fpkxqbzaxpihkeysmhsv
- **API Settings**: https://supabase.com/dashboard/project/fpkxqbzaxpihkeysmhsv/settings/api
- **SQL Editor**: https://supabase.com/dashboard/project/fpkxqbzaxpihkeysmhsv/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/fpkxqbzaxpihkeysmhsv/editor

## 🚨 Troubleshooting

If you see errors about missing credentials:

1. Double-check the environment variable names match exactly
2. Ensure no extra spaces or quotes around the values
3. Restart the FastAPI server after updating `.env`
4. Check the `/api/config` endpoint to verify configuration

Your StudySync AI backend will be fully functional once these credentials are configured!

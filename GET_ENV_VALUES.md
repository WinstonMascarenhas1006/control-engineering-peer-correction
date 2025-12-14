# How to Get Environment Variable Values

## 1. DATABASE_URL

### Option A: Vercel Postgres (Recommended - Easiest)

1. **After deploying to Vercel:**
   - Go to your Vercel project dashboard
   - Click **"Storage"** tab
   - Click **"Create Database"** → Select **"Postgres"**
   - Click **"Create"**
   - Copy the **"Connection String"** (it will look like: `postgres://default:xxxxx@ep-xxx.region.aws.neon.tech:5432/verceldb?sslmode=require`)

2. **Use this as your DATABASE_URL value**

### Option B: Neon (Free PostgreSQL)

1. Go to: https://neon.tech
2. Sign up/login
3. Click **"Create Project"**
4. Choose a name and region
5. After creation, go to **"Connection Details"**
6. Copy the **"Connection String"** (starts with `postgresql://`)
7. Use this as your DATABASE_URL value

### Option C: Supabase (Free PostgreSQL)

1. Go to: https://supabase.com
2. Sign up/login
3. Click **"New Project"**
4. Fill in details and create
5. Go to **Settings** → **Database**
6. Copy the **"Connection String"** under **"Connection string"** section
7. Use this as your DATABASE_URL value

### Option D: Railway (Free PostgreSQL)

1. Go to: https://railway.app
2. Sign up/login
3. Click **"New Project"**
4. Click **"Provision PostgreSQL"**
5. Click on the PostgreSQL service
6. Go to **"Variables"** tab
7. Copy the **"DATABASE_URL"** value
8. Use this as your DATABASE_URL value

---

## 2. ADMIN_SECRET

Generate a strong random secret. You can use one of these methods:

### Method 1: Online Generator
- Go to: https://randomkeygen.com
- Copy a "CodeIgniter Encryption Keys" (64 characters)

### Method 2: PowerShell (Windows)
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Method 3: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Example Value:
```
aB3xK9mP2qR7vN4wT8yU1zA5bC6dE0fG9hI2jK3lM4nO5pQ6rS7tU8vW9xY0zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2kL3mN4oP5qR6sT7uV8wX9yZ0
```

**IMPORTANT:** Keep this secret safe! Don't share it publicly.

---

## 3. ADMIN_USERNAME

**Value:** `71791`

Or any username you prefer for admin login.

---

## 4. ADMIN_PASSWORD

**Value:** `71791`

Or any password you prefer for admin login.

**IMPORTANT:** Change this to a strong password in production!

---

## 5. NEXT_PUBLIC_APP_URL

**After your first deployment:**
1. Vercel will give you a URL like: `https://control-engineering-peer-correction.vercel.app`
2. Use this as your `NEXT_PUBLIC_APP_URL` value
3. Add it to environment variables
4. Redeploy

**For now, you can use a placeholder:**
```
https://control-engineering-peer-correction.vercel.app
```

---

## Quick Setup Script

Run this PowerShell script to generate values:

```powershell
.\generate-env-values.ps1
```

This will generate an ADMIN_SECRET for you.

---

## Example .env File (for reference)

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
ADMIN_SECRET="your-generated-secret-here"
ADMIN_USERNAME="71791"
ADMIN_PASSWORD="71791"
NEXT_PUBLIC_APP_URL="https://control-engineering-peer-correction.vercel.app"
```

---

## Step-by-Step for Vercel

1. **Deploy first** (without DATABASE_URL) - this will give you your app URL
2. **Create Vercel Postgres database** in your project
3. **Copy the connection string** from Vercel Storage
4. **Add all environment variables** in Vercel Settings
5. **Redeploy** to apply changes
6. **Run Prisma migrations** (see VERCEL_SETUP.md)


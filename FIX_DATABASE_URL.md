# Fix DATABASE_URL in Vercel

## The Problem
Your `DATABASE_URL` in Vercel is set to:
```
https://control-engineering-peer-correction.vercel.app
```

This is **WRONG** - it's your app URL, not a database connection string!

## The Solution

You need to set `DATABASE_URL` to your actual PostgreSQL connection string.

### Step 1: Check if you have a Vercel Postgres Database

1. Go to: https://vercel.com/dashboard
2. Click your project: **control-engineering-peer-correction**
3. Click the **"Storage"** tab (in the top navigation)
4. Check if you see a **Postgres** database listed

### Step 2A: If you DON'T have a database yet

**Create Vercel Postgres:**

1. In your Vercel project, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Name it: `control-engineering-db` (or any name)
5. Click **"Create"**
6. After creation, you'll see the connection details
7. **Copy the connection string** (it will look like: `postgres://default:xxxxx@ep-xxx.region.aws.neon.tech:5432/verceldb?sslmode=require`)

### Step 2B: If you DO have a database

**Get the connection string:**

1. In your Vercel project, click **"Storage"** tab
2. Click on your **Postgres** database
3. Go to **"Settings"** or **"Connection String"** section
4. **Copy the connection string**

### Step 3: Update DATABASE_URL in Vercel

1. Go to: **Settings** → **Environment Variables**
2. Find **DATABASE_URL** in the list
3. Click **"Edit"** or the three dots menu
4. **Delete** the current value (`https://control-engineering-peer-correction.vercel.app`)
5. **Paste** your PostgreSQL connection string (from Step 2)
6. Make sure it's set for all environments: **Production**, **Preview**, **Development**
7. Click **"Save"**

### Step 4: Redeploy

After updating the environment variable:

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

### Step 5: Run Database Setup (Locally)

After redeploying, run the database setup locally:

```powershell
.\setup-database-simple.ps1
```

When prompted, paste the **same PostgreSQL connection string** you just added to Vercel.

## What the DATABASE_URL Should Look Like

✅ **Correct format:**
```
postgres://default:xxxxx@ep-xxx-xxx.region.aws.neon.tech:5432/verceldb?sslmode=require
```

❌ **Wrong format:**
```
https://control-engineering-peer-correction.vercel.app
```

## Alternative: Use External Database

If you prefer to use an external database:

### Option 1: Neon (Free)
1. Go to: https://neon.tech
2. Sign up and create a project
3. Copy the connection string
4. Add it as `DATABASE_URL` in Vercel

### Option 2: Supabase (Free)
1. Go to: https://supabase.com
2. Sign up and create a project
3. Go to Settings → Database
4. Copy the connection string
5. Add it as `DATABASE_URL` in Vercel

### Option 3: Railway (Free)
1. Go to: https://railway.app
2. Create a new project
3. Add PostgreSQL
4. Copy the connection string
5. Add it as `DATABASE_URL` in Vercel

## After Fixing

Once you've updated `DATABASE_URL` in Vercel:
1. ✅ Redeploy your app
2. ✅ Run `.\setup-database-simple.ps1` locally with the correct connection string
3. ✅ Your registration form will work!
4. ✅ Admin dashboard will load without errors!


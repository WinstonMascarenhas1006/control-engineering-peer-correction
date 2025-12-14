# Vercel Deployment Setup Guide

## Current Configuration ✅

Your Vercel import screen shows:
- ✅ **Project Name**: `control-engineering-peer-correction` (correct)
- ✅ **Framework Preset**: `Next.js` (correct)
- ✅ **Root Directory**: `./` (correct)
- ✅ **Branch**: `main` (correct)

## ⚠️ Important: Expand and Configure These Sections

### 1. Build and Output Settings

Click to expand **"Build and Output Settings"** and verify:

- **Build Command**: Should be `npm run build` (or leave default)
- **Output Directory**: Should be `.next` (or leave default)
- **Install Command**: Should be `npm install` (or leave default)

These should be auto-detected correctly, but verify they match.

### 2. Environment Variables (CRITICAL - Must Add!)

Click to expand **"Environment Variables"** and add these:

#### Required Environment Variables:

1. **DATABASE_URL**
   - Value: Your PostgreSQL connection string
   - Example: `postgresql://user:password@host:5432/database?schema=public`
   - For Vercel, use a service like:
     - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (recommended)
     - [Neon](https://neon.tech) (free tier available)
     - [Supabase](https://supabase.com) (free tier available)
     - [Railway](https://railway.app) (free tier available)

2. **ADMIN_SECRET**
   - Value: A strong random secret (generate one)
   - Example: `your-super-secret-admin-key-change-this`
   - Generate: `openssl rand -base64 32` or use an online generator

3. **ADMIN_USERNAME** (optional, defaults to `71791`)
   - Value: `71791` (or your preferred username)

4. **ADMIN_PASSWORD** (optional, defaults to `71791`)
   - Value: `71791` (or your preferred password)

5. **NEXT_PUBLIC_APP_URL**
   - Value: Your Vercel deployment URL (will be like `https://control-engineering-peer-correction.vercel.app`)
   - You can update this after first deployment

### 3. After Adding Environment Variables

1. Click **"Deploy"** button
2. Wait for the build to complete
3. Once deployed, you'll get a URL like: `https://control-engineering-peer-correction.vercel.app`

### 4. Post-Deployment Steps

#### A. Set up Database

**Option 1: Vercel Postgres (Easiest)**
1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** → **Postgres**
3. Copy the connection string
4. Add it as `DATABASE_URL` in Environment Variables
5. Redeploy

**Option 2: External Database (Neon/Supabase/Railway)**
1. Create a PostgreSQL database on your chosen service
2. Copy the connection string
3. Add it as `DATABASE_URL` in Environment Variables
4. Redeploy

#### B. Run Database Migrations

After deployment, you need to run Prisma migrations. You can do this via:

1. **Vercel CLI** (recommended):
   ```bash
   npx vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Or use Prisma Studio** locally with the production DATABASE_URL

#### C. Update NEXT_PUBLIC_APP_URL

1. After first deployment, copy your Vercel URL
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` with your actual URL
4. Redeploy

## Quick Checklist

Before clicking "Deploy":
- [ ] Project name is correct
- [ ] Framework is Next.js
- [ ] Root directory is `./`
- [ ] **Environment Variables section is expanded**
- [ ] **DATABASE_URL is added** (or you'll add it after first deploy)
- [ ] **ADMIN_SECRET is added**
- [ ] ADMIN_USERNAME is added (optional)
- [ ] ADMIN_PASSWORD is added (optional)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct build scripts

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel IPs
- Ensure database is accessible (not behind firewall)

### App Works but Database Errors
- Run Prisma migrations: `npx prisma migrate deploy`
- Verify DATABASE_URL in environment variables
- Check Prisma schema matches database

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Deploy: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel


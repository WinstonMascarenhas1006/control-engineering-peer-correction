# Quick Deploy to Vercel - Step by Step

## Step 1: Login to Vercel

Run this command in your terminal:
```bash
vercel login
```

This will open your browser to authenticate with Vercel. If you don't have an account, sign up for free at [vercel.com](https://vercel.com)

## Step 2: Deploy to Vercel

Once logged in, run:
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time)
- **Project name?** → Press Enter (uses default) or type a name
- **Directory?** → Press Enter (uses current directory)
- **Override settings?** → No

## Step 3: Set Up Database

After deployment, you need a PostgreSQL database:

### Option A: Vercel Postgres (Easiest)
1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database" → Select "Postgres"
4. Copy the connection string

### Option B: External Database (Free Options)
- **Supabase**: https://supabase.com (Free tier)
- **Neon**: https://neon.tech (Free tier)
- **Railway**: https://railway.app (Free tier)

## Step 4: Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
DATABASE_URL=your-postgresql-connection-string-here
ADMIN_SECRET=71791
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Important**: 
- Replace `your-postgresql-connection-string-here` with your actual database URL
- Change `ADMIN_SECRET` to a strong random secret (not 71791 in production!)
- Replace `your-app-name.vercel.app` with your actual Vercel URL

## Step 5: Run Database Migrations

After setting environment variables, you need to set up the database schema:

1. **Option 1: Via Vercel CLI** (Recommended)
   ```bash
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

2. **Option 2: Via Vercel Dashboard**
   - Go to your project → Settings → Deploy Hooks
   - Create a deploy hook that runs migrations
   - Or use Vercel's Postgres dashboard to run SQL manually

## Step 6: Redeploy

After setting environment variables, redeploy:
```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## Your Live URL

After deployment, Vercel will give you a URL like:
- Preview: `https://your-project-abc123.vercel.app`
- Production: `https://your-project.vercel.app` (if you set a custom domain)

## Troubleshooting

- **Build fails?** Check Vercel build logs
- **Database connection error?** Verify DATABASE_URL is correct
- **Environment variables not working?** Make sure to redeploy after adding them
- **Images not loading?** They're in the public folder and should work automatically

## Quick Commands Reference

```bash
# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```


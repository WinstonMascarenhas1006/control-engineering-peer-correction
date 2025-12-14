# Automatic Database Setup

## Quick Fix - Run This Once

I've created an automatic database initialization endpoint. Just visit this URL once:

```
https://control-engineering-peer-correction.vercel.app/api/admin/init-db
```

This will automatically create all database tables on your production database.

## What This Does

1. Connects to your database using the DATABASE_URL from Vercel
2. Creates all required tables automatically
3. Returns success message when done

## After Running

1. Visit the URL above in your browser
2. You should see: `{"success":true,"message":"Database tables created successfully!"}`
3. Try registering again - it should work!

## Alternative: Use Vercel CLI

If the endpoint doesn't work, use Vercel CLI:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Create tables
npx prisma db push --accept-data-loss
```

## Manual Method

1. Get DATABASE_URL from Vercel Dashboard → Settings → Environment Variables
2. Create `.env.local` with: `DATABASE_URL="your-connection-string"`
3. Run: `npx prisma db push --accept-data-loss`


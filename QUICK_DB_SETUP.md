# Quick Database Setup - Copy & Paste Method

## Get DATABASE_URL from Vercel

1. Go to: https://vercel.com/dashboard
2. Click your project: **control-engineering-peer-correction**
3. Go to: **Settings** → **Environment Variables**
4. Find **DATABASE_URL** and click to reveal the value
5. **Copy the entire connection string**

## Run Setup (Choose One Method)

### Method 1: Interactive Script (Easiest)

```powershell
.\setup-db-with-url.ps1
```

When prompted, paste your DATABASE_URL.

### Method 2: Manual Setup

1. Create `.env.local` file in your project root:
   ```env
   DATABASE_URL="paste-your-connection-string-here"
   ```

2. Run these commands:
   ```powershell
   npx prisma generate
   npx prisma db push --accept-data-loss
   ```

### Method 3: One-Line Command

Replace `YOUR_DATABASE_URL` with your actual connection string:

```powershell
$env:DATABASE_URL="YOUR_DATABASE_URL"; npx prisma generate; npx prisma db push --accept-data-loss
```

## After Setup

✅ Refresh your admin dashboard - error should be gone!  
✅ Register test students from the home page  
✅ View them in the admin dashboard

## Verify It Worked

```powershell
npx prisma studio
```

This opens Prisma Studio where you can see your database tables.


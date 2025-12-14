# Debugging "Internal Server Error"

## Possible Causes

### 1. Vercel DATABASE_URL Not Set Correctly

The database tables were created locally, but Vercel might not have the correct DATABASE_URL.

**Check:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click the eye icon next to `DATABASE_URL`
3. Verify it shows the PostgreSQL connection string (starts with `postgres://`)
4. If it's wrong, update it and redeploy

### 2. Database Connection Issue

The database might not be accessible from Vercel.

**Check:**
- Is your database accessible from external IPs?
- Is the connection string correct?
- Are there any firewall restrictions?

### 3. Prisma Client Not Generated on Vercel

Even though we added `prisma generate` to the build, there might be an issue.

**Check Vercel build logs:**
- Look for "Generated Prisma Client" message
- Check if there are any Prisma errors

### 4. Database Tables Not Created on Production Database

The tables were created locally, but might not exist on the production database.

**Solution:**
Run the database setup again, but make sure you're connecting to the same database that Vercel uses.

## Quick Fixes

### Fix 1: Verify DATABASE_URL in Vercel

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Check `DATABASE_URL` value
4. If wrong, update it
5. Redeploy

### Fix 2: Run Database Setup with Production Connection

1. Get the exact DATABASE_URL from Vercel
2. Run: `.\setup-database-simple.ps1`
3. Paste the connection string from Vercel (not local)

### Fix 3: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Your Project → Functions tab
3. Check for error logs
4. Look for database connection errors

### Fix 4: Test Database Connection

Run this locally to test if the connection works:

```powershell
# Create a test script
$env:DATABASE_URL="your-vercel-database-url-here"
npx prisma db push --accept-data-loss
```

## What Error Are You Seeing?

Please check:
1. **Registration page**: What exact error message?
2. **Admin dashboard**: What error?
3. **Browser console**: Any JavaScript errors?
4. **Vercel logs**: Check Function logs in Vercel dashboard

## Common Solutions

### Solution 1: Ensure DATABASE_URL is Correct in Vercel

The most common issue is that Vercel has the wrong DATABASE_URL.

### Solution 2: Redeploy After Setting DATABASE_URL

After updating DATABASE_URL, you MUST redeploy for changes to take effect.

### Solution 3: Verify Database is Accessible

Make sure your database allows connections from Vercel's IP addresses.


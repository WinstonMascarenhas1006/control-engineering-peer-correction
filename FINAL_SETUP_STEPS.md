# Final Steps to Fix "Failed to load roster" Error

## Current Status
✅ App is deployed  
✅ Database connection string is ready  
❌ Database tables not created yet  
❌ Admin dashboard shows "Failed to load roster"

## Step 1: Update DATABASE_URL in Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click your project: `control-engineering-peer-correction`

2. **Update Environment Variable:**
   - Go to: **Settings** → **Environment Variables**
   - Find `DATABASE_URL`
   - Click **"Edit"**
   - Delete the old value
   - Paste this connection string:
     ```
     postgres://6fca5a2243b8854781a81848fed0d80cbbcd705727ea88c4ff0d5ab1d27eccad:sk_ETBFikANMeSdhQ4rGJQS7@db.prisma.io:5432/postgres?sslmode=require
     ```
   - Make sure it's set for: **Production**, **Preview**, **Development**
   - Click **"Save"**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click three dots on latest deployment
   - Click **"Redeploy"**

## Step 2: Create Database Tables (Run Locally)

1. **Open PowerShell in your project folder:**
   ```powershell
   cd d:\control_proj
   ```

2. **Run the setup script:**
   ```powershell
   .\setup-database-simple.ps1
   ```

3. **When prompted, paste the connection string:**
   ```
   postgres://6fca5a2243b8854781a81848fed0d80cbbcd705727ea88c4ff0d5ab1d27eccad:sk_ETBFikANMeSdhQ4rGJQS7@db.prisma.io:5432/postgres?sslmode=require
   ```

4. **Wait for it to complete:**
   - It will generate Prisma Client
   - It will create the database tables
   - You'll see "SUCCESS! Database tables created!"

## Step 3: Verify

1. **Refresh your admin dashboard:**
   - The "Failed to load roster" error should be gone
   - You'll see "No registrations found" (which is normal - no students registered yet)

2. **Test registration:**
   - Go to your home page
   - Click "Register / Update"
   - Fill in the form and submit
   - It should work now!

3. **Check admin dashboard:**
   - Refresh the admin dashboard
   - You should see the student you just registered

## Troubleshooting

### If Step 2 fails:
- Make sure you copied the entire connection string
- Check your internet connection
- Verify the database is accessible

### If admin dashboard still shows error:
- Make sure you redeployed after updating DATABASE_URL
- Check Vercel deployment logs for errors
- Verify DATABASE_URL is correct in Vercel Environment Variables

## Quick Checklist

- [ ] Updated DATABASE_URL in Vercel
- [ ] Redeployed app in Vercel
- [ ] Ran `.\setup-database-simple.ps1` locally
- [ ] Pasted connection string when prompted
- [ ] Saw "SUCCESS! Database tables created!"
- [ ] Refreshed admin dashboard
- [ ] Error is gone!


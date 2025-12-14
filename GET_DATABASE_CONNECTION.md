# How to Get Your Database Connection String

## The Problem
You're seeing an error: "This project already has an existing environment variable with name DATABASE_URL"

This is because you already have a `DATABASE_URL` set to your app URL (which is wrong).

## Solution: Two Options

### Option 1: Delete the Wrong DATABASE_URL First (Recommended)

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click your project: `control-engineering-peer-correction`

2. **Delete the wrong DATABASE_URL:**
   - Go to: **Settings** → **Environment Variables**
   - Find `DATABASE_URL` in the list
   - Click the **three dots (⋮)** next to it
   - Click **"Delete"**
   - Confirm deletion

3. **Now connect your database:**
   - Go to: **Storage** tab
   - Click on your database: `control-engineering-db`
   - Click **"Connect"** button
   - Change Custom Prefix to: `DATABASE` (or leave empty)
   - Click **"Connect"**

4. **Get the connection string:**
   - After connecting, go to: **Settings** → **Environment Variables**
   - You'll see `DATABASE_URL` with the correct connection string
   - **Copy it!**

### Option 2: Get Connection String from Database Directly

1. **Go to your database:**
   - Vercel Dashboard → Your Project
   - Click **"Storage"** tab
   - Click on your database: `control-engineering-db`

2. **Find connection details:**
   - Look for **"Connection String"** or **"Connection Details"** section
   - Or go to **"Settings"** tab in the database page
   - You'll see the connection string there

3. **Copy the connection string:**
   - It will look like: `postgres://default:xxxxx@ep-xxx.region.aws.neon.tech:5432/verceldb?sslmode=require`
   - Copy the entire string

4. **Update DATABASE_URL manually:**
   - Go to: **Settings** → **Environment Variables**
   - Find `DATABASE_URL`
   - Click **"Edit"**
   - Delete the wrong value (your app URL)
   - Paste the correct connection string
   - Save

### Option 3: View from Database Settings

1. **Go to Storage tab:**
   - Vercel Dashboard → Your Project → **Storage**

2. **Click on your database:**
   - Click `control-engineering-db`

3. **Check these sections:**
   - **"Overview"** tab - might show connection info
   - **"Settings"** tab - usually has connection details
   - **"Connection String"** section - direct link to copy

4. **Look for:**
   - Connection string starting with `postgres://` or `postgresql://`
   - Or individual fields: Host, Port, Database, User, Password
   - You can construct the connection string from these

## After Getting the Connection String

1. **Update in Vercel:**
   - Settings → Environment Variables
   - Update `DATABASE_URL` with the correct value

2. **Redeploy:**
   - Go to Deployments
   - Redeploy the latest deployment

3. **Run local setup:**
   ```powershell
   .\setup-database-simple.ps1
   ```
   - Paste the connection string when prompted

## Quick Checklist

- [ ] Delete wrong DATABASE_URL from Environment Variables
- [ ] Connect database (Storage tab → Connect)
- [ ] Copy connection string from database settings
- [ ] Update DATABASE_URL in Environment Variables
- [ ] Redeploy app
- [ ] Run local database setup script


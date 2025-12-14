# Push to GitHub - Simple Instructions

## Current Issue
Git is authenticated as `WinstonMascarenhas1006` but the repository belongs to `winstonmascarenhas`.

## Solution: Use Personal Access Token

### Step 1: Create Token
1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Name**: `control-engineering-push`
4. **Expiration**: Choose 90 days or No expiration
5. **Select scopes**: Check **`repo`** (this gives full repository access)
6. Click **"Generate token"** at the bottom
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push with Token

**Option A: One-time push (easiest)**
```bash
git push https://YOUR_TOKEN@github.com/winstonmascarenhas/control-engineering-peer-correction.git main
```
Replace `YOUR_TOKEN` with the token you copied.

**Option B: Update remote permanently**
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/winstonmascarenhas/control-engineering-peer-correction.git
git push -u origin main
```

**Option C: Use the script**
```powershell
.\push-to-github-auth.ps1
```
Then choose option 1 and paste your token.

## After Successful Push

Your repository will be at:
**https://github.com/winstonmascarenhas/control-engineering-peer-correction**

All your project files will be visible there!

## Next Steps After Push

1. **Deploy to Vercel**:
   - Go to vercel.com
   - Import from GitHub
   - Select your repository
   - Add environment variables
   - Deploy!

2. **Set up database** (see QUICK_DEPLOY.md)


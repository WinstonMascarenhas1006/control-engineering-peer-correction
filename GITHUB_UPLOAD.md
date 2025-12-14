# Upload Project to GitHub

## Quick Steps

### Option 1: Create Repository via GitHub Website (Easiest)

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `control-engineering-peer-correction` (or any name you prefer)
3. **Description**: "Control Engineering Peer Correction System - University peer correction lookup application"
4. **Visibility**: Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

7. **Then run these commands**:
   ```bash
   git remote add origin https://github.com/WinstonMascarenhas1006/YOUR-REPO-NAME.git
   git branch -M main
   git push -u origin main
   ```

### Option 2: Using GitHub CLI (if installed)

```bash
# Login to GitHub
gh auth login

# Create repository and push
gh repo create control-engineering-peer-correction --public --source=. --remote=origin --push
```

## Current Status

✅ Git repository initialized
✅ All files committed
✅ Ready to push

## After Uploading

Once uploaded, you can:
1. Deploy to Vercel directly from GitHub
2. Share the repository
3. Set up CI/CD

## Repository URL

After creating, your repository will be at:
`https://github.com/WinstonMascarenhas1006/control-engineering-peer-correction`


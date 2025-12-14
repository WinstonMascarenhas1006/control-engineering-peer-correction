# GitHub Authentication Setup

## Issue
The repository belongs to `winstonmascarenhas` but git is authenticated as `WinstonMascarenhas1006`.

## Solution Options

### Option 1: Use Personal Access Token (Recommended)

1. **Create a Personal Access Token**:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: `control-engineering-deploy`
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using token**:
   ```bash
   git push https://YOUR_TOKEN@github.com/winstonmascarenhas/control-engineering-peer-correction.git main
   ```

   Or update remote:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/winstonmascarenhas/control-engineering-peer-correction.git
   git push -u origin main
   ```

### Option 2: Use SSH (Alternative)

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub**:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key and save

3. **Update remote to use SSH**:
   ```bash
   git remote set-url origin git@github.com:winstonmascarenhas/control-engineering-peer-correction.git
   git push -u origin main
   ```

### Option 3: Switch Git Account

If `winstonmascarenhas` is a different account:
```bash
git config --global user.name "winstonmascarenhas"
git config --global user.email "your-email@example.com"
```

Then authenticate with that account.

## Quick Fix Script

Run this and enter your Personal Access Token when prompted:

```powershell
$token = Read-Host "Enter your GitHub Personal Access Token"
git remote set-url origin "https://$token@github.com/winstonmascarenhas/control-engineering-peer-correction.git"
git push -u origin main
```


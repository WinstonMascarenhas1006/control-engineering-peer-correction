# Create Repository and Push - Step by Step

## The repository needs to be created first!

### Step 1: Create the Repository on GitHub

1. **Click this link** (it will open GitHub with pre-filled details):
   https://github.com/new?name=control-engineering-peer-correction&description=Control+Engineering+Peer+Correction+System

2. **On the GitHub page:**
   - Repository name: `control-engineering-peer-correction` (should be pre-filled)
   - Description: `Control Engineering Peer Correction System` (should be pre-filled)
   - Choose **Public** or **Private**
   - **IMPORTANT**: Do NOT check "Add a README file", "Add .gitignore", or "Choose a license"
   - Click **"Create repository"**

### Step 2: After Creating, Push Your Code

Once the repository is created, run these commands:

```bash
git remote set-url origin https://github.com/WinstonMascarenhas1006/control-engineering-peer-correction.git
git push -u origin main
```

**If you get authentication errors**, use a Personal Access Token:

1. Get token: https://github.com/settings/tokens
2. Generate new token (classic) with `repo` scope
3. Then run:
   ```bash
   git push https://YOUR_TOKEN@github.com/WinstonMascarenhas1006/control-engineering-peer-correction.git main
   ```

### Step 3: Verify

After pushing, visit:
https://github.com/WinstonMascarenhas1006/control-engineering-peer-correction

You should see all your project files!

## Quick Command Summary

```bash
# 1. Create repo on GitHub (use the link above)
# 2. Then run:
git remote set-url origin https://github.com/WinstonMascarenhas1006/control-engineering-peer-correction.git
git push -u origin main
```


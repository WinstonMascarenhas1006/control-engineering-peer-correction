# Deploy to Vercel

## Quick Deploy Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production deployment, run: `vercel --prod`

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure environment variables (see below)
5. Click "Deploy"

## Environment Variables Setup

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
DATABASE_URL=your-postgresql-connection-string
ADMIN_SECRET=your-secure-admin-secret-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Getting a PostgreSQL Database

**Option 1: Vercel Postgres** (Recommended)
- Go to your Vercel project
- Navigate to Storage → Create Database → Postgres
- Copy the connection string to `DATABASE_URL`

**Option 2: External PostgreSQL**
- Use services like:
  - [Supabase](https://supabase.com) (Free tier available)
  - [Neon](https://neon.tech) (Free tier available)
  - [Railway](https://railway.app) (Free tier available)
  - [Render](https://render.com) (Free tier available)

## Post-Deployment Steps

1. **Run Prisma migrations**:
   ```bash
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

   Or use Vercel's deployment hooks to run migrations automatically.

2. **Update DATABASE_URL** in Vercel environment variables

3. **Set a strong ADMIN_SECRET** in environment variables

## Important Notes

- The background images (`background.jpg` and `adminbg.jpg`) are in the `public` folder and will be deployed automatically
- Make sure your `.env` file is in `.gitignore` (it should be)
- Database migrations need to be run after first deployment
- Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL after deployment

## Troubleshooting

- If build fails, check Vercel build logs
- Ensure all environment variables are set
- Verify database connection string is correct
- Check that Prisma Client is generated (`npm run db:generate`)


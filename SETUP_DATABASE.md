# Setup Database on Vercel - Step by Step

## Current Status
✅ App is deployed successfully  
✅ Admin dashboard is accessible  
❌ Database schema not created yet  
❌ "Failed to load roster" error

## Solution: Run Prisma Migrations

You need to create the database tables. Here's how:

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Link your local project to Vercel**:
   ```bash
   vercel link
   ```
   - Select your project: `control-engineering-peer-correction`
   - Select scope: Your account

3. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```
   This will create a `.env.local` file with your `DATABASE_URL` from Vercel.

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Push schema to database** (creates tables):
   ```bash
   npx prisma db push
   ```

   OR use migrations:
   ```bash
   npx prisma migrate deploy
   ```

6. **Verify it worked**:
   ```bash
   npx prisma studio
   ```
   This will open Prisma Studio where you can see your database tables.

### Option 2: Using Prisma Migrate (Alternative)

1. **Create a migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Deploy the migration**:
   ```bash
   npx prisma migrate deploy
   ```

### Option 3: Direct Database Connection

If you have direct access to your database:

1. Get your `DATABASE_URL` from Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Copy the `DATABASE_URL` value

2. Create a local `.env` file:
   ```env
   DATABASE_URL="your-connection-string-here"
   ```

3. Run:
   ```bash
   npx prisma db push
   ```

## After Setup

Once the database schema is created:

1. **Refresh your admin dashboard** - The error should be gone
2. **The table will be empty** - This is normal, no students have registered yet
3. **Test registration** - Go to the home page and register a test student
4. **Check admin dashboard** - You should see the registered student

## Troubleshooting

### Error: "Can't reach database server"
- Check if `DATABASE_URL` is set correctly in Vercel
- Verify the database is running (Vercel Postgres should be automatic)
- Check if the connection string is correct

### Error: "Table does not exist"
- Run `npx prisma db push` again
- Check Prisma schema is correct

### Error: "Authentication failed"
- Verify your `DATABASE_URL` has correct credentials
- Check if database allows connections from Vercel IPs

## Quick Test

After running migrations, test the connection:

```bash
npx prisma studio
```

If Prisma Studio opens and shows the `Student` table, you're good to go!

## Next Steps

1. ✅ Run database migrations (see above)
2. ✅ Verify tables are created
3. ✅ Test registration from the home page
4. ✅ Check admin dashboard shows the registration


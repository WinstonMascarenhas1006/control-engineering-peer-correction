# Quick Setup Guide

## Prerequisites Check

Before running the project, ensure you have:

1. **Node.js 18+** installed
   - Download from: https://nodejs.org/
   - Verify installation: Open a new terminal and run `node --version` and `npm --version`

2. **Docker Desktop** (for PostgreSQL database)
   - Download from: https://www.docker.com/products/docker-desktop
   - Or use your own PostgreSQL instance

## Step-by-Step Setup

### 1. Create `.env` file

Create a `.env` file in the project root with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/peer_correction?schema=public"
ADMIN_SECRET="dev-secret-key-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

### 3. Start PostgreSQL Database

Using Docker Compose:

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432.

### 4. Set Up Database

```bash
npm run db:generate
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Troubleshooting

### If `npm` command is not found:

1. **Restart your terminal** after installing Node.js
2. **Check Node.js installation**: Open a new terminal and run `node --version`
3. **Add Node.js to PATH** if needed (usually done automatically during installation)

### If Docker is not available:

You can use a local PostgreSQL instance instead. Update the `DATABASE_URL` in `.env` to point to your PostgreSQL server.

### If port 3000 is already in use:

Next.js will automatically try the next available port (3001, 3002, etc.). Check the terminal output for the actual URL.

## Testing the Application

1. **Homepage**: Visit http://localhost:3000
   - You should see the 3D inertia carousel
   - Try dragging/swiping to rotate it

2. **Register**: Click "Register / Update"
   - Fill in the form with test data
   - Submit to create a registration

3. **Lookup**: Click "Lookup Corrector"
   - Enter a matriculation number to find the corrector

4. **Admin**: Visit http://localhost:3000/admin/login
   - Use the secret from `.env` file (default: "dev-secret-key-change-in-production")
   - View all registrations and export to Excel


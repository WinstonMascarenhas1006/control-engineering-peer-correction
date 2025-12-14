# Control Engineering - Peer Correction System

A production-ready web application for Control Engineering peer correction. Students can register their details and look up who has their paper for correction.

## Features

- **Student Registration**: Register with matriculation numbers and contact details
- **Lookup System**: Find who is correcting your paper by entering your matriculation number
- **Admin Dashboard**: View all registrations, search, and export to Excel
- **Privacy Protection**: Rate limiting and bot deterrent (honeypot) to prevent abuse
- **No Authentication Required**: Students can register and lookup without login

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js Route Handlers (API Routes)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Excel Export**: exceljs

## Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose (for local PostgreSQL)
- PostgreSQL (if not using Docker)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/peer_correction?schema=public"
ADMIN_SECRET="your-secret-admin-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: Change `ADMIN_SECRET` to a strong, random secret in production!

### 3. Start PostgreSQL Database

Using Docker Compose (recommended):

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5432 with:
- Username: `user`
- Password: `password`
- Database: `peer_correction`

Alternatively, you can use your own PostgreSQL instance. Update `DATABASE_URL` in `.env` accordingly.

### 4. Set Up Database Schema

Generate Prisma Client and push the schema to the database:

```bash
npm run db:generate
npm run db:push
```

Or run migrations:

```bash
npm run db:migrate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Lookup Logic

The system works by matching matriculation numbers:

1. **Registration**: When a student registers, they provide:
   - `myMatriculationNumber`: Their own matriculation number (unique)
   - `paperReceivedMatriculationNumber`: The matriculation number written on the paper they received to correct

2. **Lookup**: When a student enters their matriculation number `X`:
   - The system finds the student record where `paperReceivedMatriculationNumber == X`
   - This student is the "corrector" who has paper `X`
   - The corrector's contact details are displayed

**Example**:
- Student A (matric: `ABC123`) receives paper with matric `XYZ789`
- Student A registers: `myMatriculationNumber = ABC123`, `paperReceivedMatriculationNumber = XYZ789`
- Student B (matric: `XYZ789`) looks up their matric number
- System finds Student A (because `paperReceivedMatriculationNumber == XYZ789`)
- Student B sees Student A's contact details

### Excel Export

The admin Excel export generates a `.xlsx` file with all current registrations. The file is generated on-demand from the database, ensuring it always contains the latest data. The export includes:

- My Matriculation Number
- Paper Received Matriculation Number
- Name
- Email
- WhatsApp Number
- Consent Given At
- Created At
- Updated At

## API Endpoints

### Public Endpoints

- `POST /api/register` - Register or update student information
- `POST /api/lookup` - Lookup corrector by matriculation number

### Admin Endpoints (Protected)

- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/roster` - Get all registrations
- `GET /api/admin/export.xlsx` - Download Excel roster

## Pages

- `/` - Home page with navigation
- `/register` - Student registration/update form
- `/lookup` - Lookup corrector by matriculation number
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard (protected)

## Privacy & Security

### Rate Limiting

- Rate limiting is implemented on `/api/register` and `/api/lookup`
- Limits: 10 requests per minute per IP address
- Uses in-memory storage (consider Redis for production scaling)

### Bot Deterrent

- Honeypot field on registration form (hidden input field)
- Bots that fill the honeypot field are silently rejected

### Data Protection

- No public endpoints expose full student lists
- Lookup endpoint returns only the single corrector mapping
- Admin endpoints are protected by session authentication

## Database Schema

### Student Model

```prisma
model Student {
  id                            String   @id @default(uuid())
  myMatriculationNumber         String   @unique
  paperReceivedMatriculationNumber String
  name                          String?
  email                         String
  whatsappNumber                String
  consentGivenAt                DateTime
  createdAt                     DateTime @default(now())
  updatedAt                     DateTime @updatedAt

  @@index([paperReceivedMatriculationNumber])
}
```

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Prisma commands
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## Production Deployment

1. Set strong `ADMIN_SECRET` in environment variables
2. Use a production PostgreSQL database
3. Update `DATABASE_URL` with production credentials
4. Consider using Redis for rate limiting at scale
5. Enable HTTPS
6. Set secure cookie flags in production

## License

MIT

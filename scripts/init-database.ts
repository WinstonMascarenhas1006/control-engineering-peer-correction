import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Initializing database...')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✓ Database connected')
    
    // Push schema (creates tables)
    const { execSync } = require('child_process')
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
    
    console.log('✓ Database tables created')
    console.log('✓ Database initialization complete!')
  } catch (error) {
    console.error('✗ Database initialization failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()


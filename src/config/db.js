import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import chalk from 'chalk'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool)

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
})

const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log(chalk.green('✓ Database connected successfully'))
  } catch (error) {
    console.error(chalk.red('✗ Database connection failed:'), error)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await prisma.$disconnect()
    console.log(chalk.blue('✓ Database disconnected successfully'))
  } catch (error) {
    console.error(chalk.red('✗ Error during database disconnection:'), error)
  }
}

export { prisma, connectDB, disconnectDB }

import express from 'express'
import chalk from 'chalk'
import moviesRouter from './routes/movies.route.js'
import authRouter from './routes/auth.route.js'
import { config } from 'dotenv'
import { connectDB, disconnectDB } from './config/db.js'

// Load environment variables from .env file FIRST
config()

// Connect to the database
connectDB()

const app = express()

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/movies', moviesRouter)
app.use('/auth', authRouter)

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.send('ok')
})

// Start the server
const PORT = process.env.PORT || 5001

const server = app.listen(PORT, () => {
  console.log(chalk.greenBright(`Server is running on port ${PORT}`))
})

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  server.close(async () => {
    await disconnectDB()
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err)
  await disconnectDB()
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(async () => {
    await disconnectDB()
    process.exit(0)
  })
})

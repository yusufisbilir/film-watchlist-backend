import express from 'express'
import chalk from 'chalk'
import moviesRouter from './routes/movies.route.js'

const app = express()

// API Routes
app.use('/movies', moviesRouter)

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.send('ok')
})

// Start the server
const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(chalk.greenBright(`Server is running on port ${PORT}`))
})

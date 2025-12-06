const express = require('express')
const chalk = require('chalk')

const app = express()

app.get('/health', (req, res) => {
  res.send('ok')
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(chalk.greenBright(`Server is running on port ${PORT}`))
})

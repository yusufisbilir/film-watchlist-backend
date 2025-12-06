const express = require('express')
const chalk = require('chalk')

const app = express()

const PORT = process.env.PORT || 5001

const server = app.listen(PORT, () => {
  console.log(chalk.greenBright(`Server is running on port ${PORT}`))
})

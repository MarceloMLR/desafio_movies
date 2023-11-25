require('express-async-errors')
const express = require('express');
const routes = require("./routes")
const app = express();
const port = 3000
const AppError = require('./utils/AppError')

app.use(express.json())
app.use(routes)
app.use((error, request, response, next) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message
      })
    }
  
    console.error(error)
  
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  })


app.listen(port, () => console.log(`app listening on port ${port}!`))
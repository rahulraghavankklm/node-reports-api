const express = require('express')
const http = require('http')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const methodOverride = require('method-override')
const compression = require('compression')
const favicon = require('serve-favicon')
const logger = require('morgan')

const port = process.env.port || 1350

const app = express()

// middlewares config
app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(bodyParser.json())
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(logger('combined'))
app.use(methodOverride())

/*
// custom cors config
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
*/

// Index route
app.get('/', (req, res, next) => {
  res.json({ message: 'Reports Server is active'})
})


// Listen Server
const server = app.listen(port, () => {
  console.log('Listening on port ' + server.address().port)
})

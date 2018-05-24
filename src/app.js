const express = require('express')
const http = require('http')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const expressValidation = require('express-validation')
const compression = require('compression')
const json2xls = require('json2xls')
const favicon = require('serve-favicon')
const logger = require('morgan')

const port = process.env.port || 1350

const db = require('./db')

const app = express()

// nunjucks config
exports.env = nunjucks.configure(path.join(__dirname, 'static'), {
  autoescape: true,
  express: app
})

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
app.use(json2xls.middleware)

const UserController = require('./user/UserController')
const AuthController = require('./auth/AuthController')

const LedgerReport = require('./routes/reports/LedgerReport')
const Vouchers = require('./routes/transactions/Vouchers')
const SalesVouchers = require('./routes/transactions/SalesVouchers')
const TrialBalance = require('./routes/reports/TrialBalance')

app.use('/api/users', UserController)
app.use('/api/auth', AuthController)

app.use('/api/reports', LedgerReport)
app.use('/api/reports', TrialBalance)
app.use('/api/vouchers', Vouchers)
app.use('/api/transactions', SalesVouchers)

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
  res.json({ message: 'Reports Server is active' })
})

// empty route
app.all('*', (req, res, next) => {
  let err = new Error('Route Not Found')
  err.statusCode = 404
  next(err)
})

// error middleware
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    return res.status(err.status).json(err)
  }

  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send({
    error: err.message || 'Internal Server Error'
  })
})

// Listen Server
const server = app.listen(port, () => {
  console.log('Listening on port ' + server.address().port)
})

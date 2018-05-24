const fs = require('fs')
const router = require('express').Router()
const pdf = require('html-pdf')
const validate = require('express-validation')
const merge = require('lodash.merge')

const appmodule = require('../../app')
const VerifyToken = require('../../auth/VerifyToken')
const validateTrialBalance = require('./validate/validation').trialBalance

const default_options = {
  "format": "A4",
  "orientation": "portrait",
  "border": {
    "top": "0.5in",
    "right": "0.5in",
    "bottom": "0.2in",
    "left": "0.5in"
  },
  "footer": {
    "contents": '<p style="margin: 16px 0;"><span style="color: #444;">Page {{page}}</span>/<span>{{pages}}</span></p>'
  },
  "timeout": 120000,
}

router.post('/trial_balance/pdf', VerifyToken, validate(validateTrialBalance), (req, res, next) => {
  const { data, options } = req.body
  const { template = 'simple' } = options
  const pdf_options = merge(default_options, options) || {}

  const templateURI = `./pdf/reports/trial_balance/trial_balance_${template}.html`

  appmodule.env.render(templateURI, data, (err, renderedHtml) => {
    if (err) return next(err)
    pdf.create(renderedHtml, pdf_options).toStream((err, stream) => {
      if (err) return next(err)
      stream.pipe(res)
    })
  })
})

/*
 *  api for testing pdf rendering
 *  remove before production
 */

router.get('/trial_balance/pdf/test', (req, res, next) => {
  const fakeData = require('../data/trial_balance.json')
  const data = { report: fakeData }
  appmodule.env.render('./pdf/trial_balance.html', data, (err, renderedHtml) => {
    if (err) return next(err)
    pdf.create(renderedHtml, pdf_options).toStream((err, stream) => {
      if (err) return next(err)
      stream.pipe(res)
    })
  })
})

module.exports = router

const router = require('express').Router()
const pdf = require('html-pdf')
const validate = require('express-validation')
const merge = require('lodash.merge')

const appmodule = require('../../app')
const VerifyToken = require('../../auth/VerifyToken')
const validateVoucher = require('./validate/validation').Vouchers

const default_options = {
  "height": "14.85cm",
  "width": "21.00cm",
  "orientation": "portrait",
  "border": {
    "top": "0.5cm",
    "right": "0.5cm",
    "bottom": "0.5cm",
    "left": "0.5cm"
  },
  "footer": {
    "contents": '<p style="margin: 16px 0;"><span style="color: #444;">Page {{page}}</span>/<span>{{pages}}</span></p>'
  },
  "timeout": 120000,
}

router.post('/print', validate(validateVoucher), (req, res, next) => {
  const { data, options } = req.body
  const pdf_options = merge(default_options, options) || {}
  const templateURI = `./pdf/transactions/Vouchers/vouchers.html`

  appmodule.env.render(templateURI, data, (err, renderedHtml) => {
    if (err) return next(err)
    pdf.create(renderedHtml, pdf_options).toStream((err, stream) => {
      if (err) return next(err)
      res.type('pdf')
      stream.pipe(res)
    })
  })
})

module.exports = router

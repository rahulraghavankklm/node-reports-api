const router = require('express').Router()
const pdf = require('html-pdf')
const validate = require('express-validation')
const merge = require('lodash.merge')

const appmodule = require('../../app')
const VerifyToken = require('../../auth/VerifyToken')
const repearArray = require('../../utils/repeatArray')
const validateVoucher = require('./validate/validation').Vouchers

const default_options = {
  "format": "A4",
  "orientation": "landscape",
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

router.post('/sales_inventory/pdf', VerifyToken, validate(validateVoucher), (req, res, next) => {

  const { data, options = { download: false } } = req.body
  const pdf_options = merge(default_options, options) || {}

  const templateURI = `./pdf/transactions/InventorySales/inventory_sales.html`

  appmodule.env.render(templateURI, data, (err, renderedHtml) => {
    if (err) return next(err)
    pdf.create(renderedHtml, pdf_options).toStream((err, stream) => {
      if (err) return next(err)

      if (options.download) {
        const fileName = `ledger-report-${data['ledger'].toUpperCase()}.xlsx`
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName )
        res.setHeader('Content-type', 'application/pdf')
      }

      stream.pipe(res)
    })
  })
})

module.exports = router


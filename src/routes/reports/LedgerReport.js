const router = require('express').Router()
const pdf = require('html-pdf')
const html2xlsx = require('html-to-xlsx')
const validate = require('express-validation')
const merge = require('lodash.merge')

const appmodule = require('../../app')
const VerifyToken = require('../../auth/VerifyToken')
const repearArray = require('../../utils/repeatArray')
const validateLedger = require('./validate/validation').ledgerReport

const default_options = {
  format: 'A4',
  orientation: 'portrait',
  border: {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.2in',
    left: '0.5in'
  },
  footer: {
    contents:
      '<p style="margin: 16px 0;"><span style="color: #444;">Page {{page}}</span>/<span>{{pages}}</span></p>'
  },
  timeout: 120000
}

// PDF export
router.post('/ledger_report/pdf', VerifyToken, validate(validateLedger), (req, res, next) => {
  const { data, options = { download: false } } = req.body
  const { template = 'simple' } = options
  const pdf_options = merge(default_options, options) || {}

  const templateURI = `./pdf/reports/ledger_report/ledger_report_${template}.html`

  appmodule.env.render(templateURI, data, (err, renderedHtml) => {
    if (err) return next(err)
    pdf.create(renderedHtml, pdf_options).toStream((err, stream) => {
      if (err) return next(err)

      if (options.download) {
        const fileName = `ledger-report-${data['ledger'].toUpperCase()}.pdf`
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
        res.setHeader('Content-type', 'application/pdf')
      }

      stream.pipe(res)
    })
  })
})

// XLSX export
const xlsxConverter = html2xlsx({
  numberOfWorkers: 2,
  timeout: 120000
})

router.post('/ledger_report/xlsx', VerifyToken, (req, res, next) => {
  const data = req.body.data
  const ledgerName = data.ledger
  const fileName = `ledger-report-${ledgerName.toUpperCase()}.xlsx`

  appmodule.env.render('./xlsx/ledger_report.html', data, (err, renderedHtml) => {
    xlsxConverter(renderedHtml, (err, stream) => {
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
      res.setHeader('Content-type', 'application/vnd.ms-excel')
      stream.pipe(res)
    })
  })
})

// export with json2xls
router.post('/ledger_report/xls', VerifyToken, (req, res, next) => {
  const jsonData = req.body.data.lines

  const fields = [
    'voucher_no',
    'transaction_date',
    'ledger_name',
    'voucher_type',
    'debit_amount',
    'credit_amount'
  ]

  res.setHeader('Content-disposition', 'attachment; filename=ledger-report.xlsx')
  res.setHeader('Content-type', 'application/vnd.ms-excel')
  res.xls('ledger-report.xlsx', jsonData, { fields: fields })
})

module.exports = router

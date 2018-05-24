const Joi = require('joi')

module.exports = {
  ledgerReport: {
    body: {
      data: Joi.object().keys({
        company: Joi.string().required(),
        ledger: Joi.string().required(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
        opening_balance: Joi.string().required(),
        closing_balance: Joi.string().required(),
        lines: Joi.array().items(
          Joi.object().keys({
            id: Joi.number(),
            voucher_no: Joi.number().required(),
            transaction_date: Joi.string().required(),
            ledger_name: Joi.string().required(),
            voucher_type: Joi.string().required(),
            credit_amount: Joi.string().allow('').required(),
            debit_amount: Joi.string().allow('').required()
          })
        )
      }).required()
    }
  },
  trialBalance: {
    body: {
      data: Joi.object().keys({
        company: Joi.string().required(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
        opening_debit: Joi.string().required(),
        opening_credit: Joi.string().required(),
        closing_debit: Joi.string().required(),
        closing_credit: Joi.string().required(),
        lines: Joi.array().items(
          Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required(),
            opening_credit: Joi.string().allow('').required(),
            opening_debit: Joi.string().allow('').required(),
            closing_credit: Joi.string().allow('').required(),
            closing_debit: Joi.string().allow('').required()
          })
        )
      }).required()
    }
  }
}

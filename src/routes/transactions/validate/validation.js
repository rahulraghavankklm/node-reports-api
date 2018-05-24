const Joi = require('joi')

module.exports = {
  Vouchers: {
    body: {
      data: Joi.object().keys({
        company_name: Joi.string().required(),
        company_address: Joi.string().required(),
        document_date: Joi.string().allow(null).required(),
        document_no: Joi.string().allow(null).required(),
        voucher_kind: Joi.string().required(),
        lines: Joi.array().items(
          Joi.object().keys({
            voucher_id: Joi.number().required(),
            ledger_id: Joi.number().required(),
            ledger_name: Joi.string().required(),
            sequence: Joi.number().allow('').required(),
            cr_dr: Joi.number().required(),
            amount: Joi.number().allow('').required(),
            actual_amount: Joi.number().allow(null).required(),
            currency_code: Joi.string(),
            description: Joi.string().allow(null).allow('').required()
          })
        )
      }).required()
    }
  }
}

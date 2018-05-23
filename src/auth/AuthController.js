const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

const config = require('../config/main')
const User = require('../user/User')

router.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8)

  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    },
    (err, user) => {
      if (err) return res.status(500).send('There was a problem creating the user')

      // if user is created , create a token
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      })

      return res.status(200).send({ auth: true, token: token })
    }
  )
})

module.exports = router

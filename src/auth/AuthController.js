const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/main')
const User = require('../user/User')
const VerifyToken = require('./VerifyToken')

const router = express.Router()

// register
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

      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      })

      res.status(200).send({ auth: true, token: token })
    }
  )
})

// login
router.post('/login', (req, res) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) return res.status(500).send('Internal Server Error')
    if (!user) return res.status(404).send('User not found')

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    })

    res.status(200).send({ auth: true, token: token })
  })
})

// logout
router.get('/logout', (req, res) => {
  return res.status(200).send({ auth: false, token: null })
})

// profile
router.get('/profile', VerifyToken, (req, res) => {
  User.findById(req.userId, { password: 0 }, (err, user) => {
    if (err) return res.status(500).send('There was a problem finding the user.')
    if (!user) return res.status(404).send('No user found.')
    res.status(200).send(user)
  })
})

module.exports = router

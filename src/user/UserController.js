const express = require('express')
const router = express.Router()

const User = require('./User')

// CREATE NEW User
router.post('/', (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  },
  (err, user) => {
    if (err) return res.status(500).send('There was a problem adding user to the database')
    return res.status(200).send(user)
  })
})

module.exports = router

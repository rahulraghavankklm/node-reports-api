const express = require('express')
const router = express.Router()
const VerifyToken = require('../auth/VerifyToken')

const User = require('./User')

// create user
router.post('/', VerifyToken, (req, res) => {
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    },
    (err, user) => {
      if (err) return res.status(500).send('There was a problem adding user to the database')
      return res.status(200).send(user)
    }
  )
})

// get all users
router.get('/', VerifyToken, (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send('There was a problem finding the users.')
    if (!users) return res.status(404).send('No users found.')
    res.status(200).send(users)
  })
})

// get single user
router.get('/:id', VerifyToken, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).send('There was a problem finding the user.')
    if (!user) return res.status(404).send('No user found.')
    res.status(200).send(user)
  })
})

// delete user
router.delete('/:id', VerifyToken, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).send('There was a problem finding the user.')
    res.status(200).send('User: ' + user.name + ' was deleted.')
  })
})

// update user
router.put('/:id', VerifyToken, (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true
    },
    (err, user) => {
      if (err) return res.status(500).send('There was a problem updating the user.')
      res.status(200).send(user)
    }
  )
})

module.exports = router

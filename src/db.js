const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/reports-node');

const db = mongoose.connection

db.on('error', console.error.bind(console, 'db connection error'))
db.once('open', function() {
  console.log.bind(console, 'database connected')
})

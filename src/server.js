/*
 *   SERVER JS
 */

const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // for workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  Object.keys(cluster.workers).forEach(function(id) {
    console.log('Cluster running with ID : ' + cluster.workers[id].process.pid)
  })

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died')
  })
} else {
  require('./app.js')
}

const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  // app.use(proxy('/socket.io', {
  //   target: 'http://localhost:1337',
  //   ws: true
  // }))

  // // You only need this part if your server also has actual express endpoints
  // app.use(proxy('/api', {
  //   target: 'http://localhost:1337',
  //   pathRewrite: { '^/api': '' }
  // }))
}
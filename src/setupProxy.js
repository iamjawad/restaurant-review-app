const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api/map', { contex: '/api/map^', target: 'http://maps.googleapis.com', changeOrigin: true, pathRewrite: {'^/api/map' : ''}}))

}

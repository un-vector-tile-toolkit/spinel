const config = require('config')
const app = require('./app.js')
const fs = require('fs')
const spdy = require('spdy')

spdy.createServer({
  key: fs.readFileSync(config.get('privkey')),
  cert: fs.readFileSync(config.get('fullchain')),
  ca: fs.readFileSync(config.get('chain'))
}, app).listen(config.get('port'))

const config = require('config')
const app = require('./app.js')

console.error(`spinel vector tile server starts on ${config.get('port')}`)
app.listen(config.get('port'))

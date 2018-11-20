const config = require('config')
const app = require('./app.js')

app.listen(config.get('port'))

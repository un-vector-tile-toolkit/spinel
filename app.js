const fs = require('fs')
const zlib = require('zlib')
const express = require('express')
const spdy = require('spdy')
const cors = require('cors')
const morgan = require('morgan')
const MBTiles = require('@mapbox/mbtiles')
const config = require('config')

const app = express()
app.use(cors())
app.use(morgan(config.get('morgan-format')))
app.use(express.static(config.get('htdocs')))

module.exports = app


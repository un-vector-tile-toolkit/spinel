const config = require('config')
const fs = require('fs')
const zlib = require('zlib')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const MBTiles = require('@mapbox/mbtiles')

// cache of the connection to mbtiles
let mbtilesCache = {}
// t to module z
let tz = config.get("tz")

// basic express server initialization
const app = express()
app.use(cors())
app.use(morgan(config.get('morgan-format')))
app.use(express.static(config.get('htdocs')))

const getMBTiles = async (key) => {
  return new Promise((resolve, reject) => {
    if (mbtilesCache[key]) {
      resolve(mbtilesCache[key])
    } else {
      if (fs.existsSync(`mbtiles/${key}`)) {
        mbtilesCache[key] = new MBTiles(
          `mbtiles/${key}?mode=ro`,
          (err, mbtiles) => {
            if (err) {
              reject(new Error(`MBTiles open error for ${key}`))
            } else {
              mbtilesCache[key] = mbtiles
              resolve(mbtiles)
            }
          }
        )
      } else {
        reject(new Error(`mbtiles/${key} not found`))
      }
    }
  })
}

const selectMBTiles = async (t, z, x, y) => {
  if (!tz[t]) tz[t] = 6
  if (z < tz[t]) {
    return getMBTiles(`${t}/0-0-0.mbtiles`)
  } else {
    return getMBTiles(`${t}/${tz[t]}-${x >> (z - tz[t])}-${y >> (z - tz[t])}.mbtiles`)
  }
}

const getTile = async (mbtiles, z, x, y) => {
  return new Promise(resolve => {
    mbtiles.getTile(z, x, y, (err, tile, headers) => {
      if (err) {
        resolve(false)
      } else {
        resolve(tile)
      }
    })
  })
}

const sendTile = async (req, res) => {
  const t = req.params.t
  const z = parseInt(req.params.z)
  const x = parseInt(req.params.x)
  const y = parseInt(req.params.y)
  selectMBTiles(t, z, x, y).then(mbtiles => {
    getTile(mbtiles, z, x, y).then(tile => {
      if (tile) {
        res.set('content-type', 'application/vnd.mapbox-vector-tile')
        res.set('content-encoding', 'gzip')
        res.send(tile)
      } else {
        res.status(404).send(`tile not found: /zxy/${t}/${z}/${x}/${y}.pbf`)
      }
    }).catch(e => {
      res.status(500).send(`getTile error: /zxy/${t}/${z}/${x}/${y}.pbf`)
    })
  }).catch(e => {
    console.log(`caught ${e}`)
    res.status(404).send(`tile not found: /zxy/${t}/${z}/${x}/${y}.pbf`)
  })
}

// route to the tile
app.get(`/zxy/:t/:z/:x/:y.pbf`, async (req, res) => {
  sendTile(req, res)
})

// route to the fonts
app.get(`/fonts/:fontstack/:range.pbf`, (req, res) => {
  res.set('content-type', 'application/x-protpbuf')
  res.set('content-encoding', 'gzip')
  for (const fontstack of req.params.fontstack.split(',')) {
    const path = `fonts/${fontstack}/${req.params.range}.pbf.gz`
    if (fs.existsSync(path)) {
      res.send(fs.readFileSync(path))
      return
    }
  }
  res.status(404).send(`font not found: ${req.params.fontstack}/${req.params.range}`)
})

module.exports = app

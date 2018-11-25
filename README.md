# spinel
# background
I wanted to provide a localhost vector tile server to be used in the OSGeo.JP Workshop for the UN Vector Tile Toolkit.

# install
```console
$ git clone git@github.com:un-vector-tile-toolkit/spinel
$ cd spinel
$ npm install
```

# usage
## copy the mbtiles file
For example, 
```console
$ cp somewhere/0-0-0.mbtiles ./mbtiles/hands-on/
```
Then the data will be available at http://localhost:8765/zxy/hands-on/{z}/{x}/{y}.pbf.

## run the server
```console
$ node index.js
```
Then http://localhost:8765 will be ready. If you want to change the port number, edit config/default.json.

# extra: to use with http/2 (spdy)
Although this will not be covered at the Workship, the procedure to add HTTP/2 support is as the following. 

## Step 1: prepare SSL certificates

## Step 2: set the certificates and run the server

```console
$ node spdy.js
```

# INTERNAL NOTE (to be deleted)
6.84/7.915/80.529
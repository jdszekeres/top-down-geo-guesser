const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8080

app.use(bodyParser.json())

const lon2tile = (lon,zoom) => (Math.floor((lon+180)/360*Math.pow(2,zoom)));
const lat2tile = (lat,zoom) => (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/place', (req, res) => {
    res.send([33, -119]);
})

app.post('/tile', (req, res) => {
    console.log(req.body);
    const lat = req.body.lat;
    const lon = req.body.lon;
    const zoom = req.body.zoom;

    const x = lon2tile(lon, zoom);
    const y = lat2tile(lat, zoom);

    const url = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ url: url }));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
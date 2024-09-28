const express = require('express')
var bodyParser = require('body-parser')
const request = require('request');

const app = express()
const port = 3000

const places = [
  { name: "LA", coord: [34, -118], zoom: 10 },
  { name: "NYC", coord: [40.780316, -74.012000], zoom: 10 },
  { name: "Yosemite", coord: [37.8651, -119.5383], zoom: 8 },
  { name: "Yellowstone", coord: [44.5979, -110.5612], zoom: 8 },
  { name: "Grand Prismatic Springs", coord: [44.525626, -110.838954], zoom: 17 },
  { name: "Statue of Liberty", coord: [40.691290, -74.047306], zoom: 16 },
  { name: "Reykjavík", coord: [64.158133, -21.998641], zoom: 10 },
  { name: "Hungarian Parliment Building", coord: [47.508748, 19.044417], zoom: 12 },
  { name: "Sydney Opera House", coord: [-33.849912, 151.207357], zoom: 14 },
]

app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/place', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify(places[Math.floor(Math.random() * places.length)]));
})



app.get('/tile/:zoom/:x/:y', (req, res) => {
  console.log(req.params);
  const x = parseFloat(req.params.x);
  const y = parseFloat(req.params.y);
  const zoom = parseInt(req.params.zoom);


  const url = `https://mt0.google.com/vt/lyrs=s&hl=en&x=${x}&y=${y}&z=${zoom}&s=Ga`

  fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' } }).then((resp) => {
    console.log(url);
    // resp.text().then(console.log);
    if (resp.status === 200) {
      res.set("Content-Type", "image/jpeg");

      resp.body.pipeTo(new WritableStream({
        start() {

        },
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      }));
    }
  })



});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
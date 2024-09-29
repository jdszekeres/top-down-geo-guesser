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
  // { name: "Reykjavík", coord: [64.158133, -21.998641], zoom: 10 },
  // { name: "Hungarian Parliment Building", coord: [47.508748, 19.044417], zoom: 12 },
  // { name: "Sydney Opera House", coord: [-33.849912, 151.207357], zoom: 14 },
  { name: "Trunk Bay, St. John, USVI", coord: [18.353863, -64.774272], zoom: 16 },
  { name: "Chugach NF, Alaska", coord: [61.145252, -147.291878], zoom: 10 },
  { name: "Denali, AK", coord: [63.068571, -151.007126], zoom: 12 },
  { name: "Milolii, Hawaii", coord: [19.185407, -155.906528], zoom: 16 },
  { name: "Laie point", coord: [21.650733, -157.920210], zoom: 14 },
  { name: "Kīlauea, Hawaii", coord: [19.409208, -155.281719], zoom: 14 },
  { name: "Crater Lake", coord: [42.944695, -122.108147], zoom: 12 },
  { name: "The Great Bend, WA", coord: [47.358338, -123.118856], zoom: 8 },
  { name: "Palouse Farming Country, WA/IA", coord: [46.538175, -117.039979], zoom: 12 },
  { name: "Mt. Chuksan, WA", coord: [48.830100, -121.603026], zoom: 12 },
  { name: "Diablo Lake, WA", coord: [48.715618, -121.121214], zoom: 10 },
  { name: "Bixby Bridge, CA", coord: [36.371488, -121.901530], zoom: 16 },
  { name: "Torrey Pines Golf Course, CA", coord: [32.904750, -117.250990], zoom: 15 },
  { name: "Lassen Peak, CA", coord: [40.486514, -121.506109], zoom: 13 },
  { name: "Lake Tahoe, CA", coord: [38.986424, -120.048984], zoom: 9 },
  { name: "Yosemite Valley, CA", coord: [37.743496, -119.594237], zoom: 13 },
  { name: "Kidney Lake, CA", coord: [37.897758, -119.197783], zoom: 13 },
  { name: "Mt. Witney, CA", coord: [36.577970, -118.293386], zoom: 9 }

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
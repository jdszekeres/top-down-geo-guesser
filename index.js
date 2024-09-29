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

  //START places from Landscapes of America book
  { name: "Trunk Bay, St. John, USVI", coord: [18.353863, -64.774272], zoom: 16 },
  { name: "Chugach NF, Alaska", coord: [61.145252, -147.291878], zoom: 10 },
  { name: "Denali, AK", coord: [63.068571, -151.007126], zoom: 12 },
  { name: "Milolii, Hawaii", coord: [19.185407, -155.906528], zoom: 16 },
  { name: "Laie point", coord: [21.650733, -157.920210], zoom: 14 },
  { name: "Kīlauea, Hawaii", coord: [19.409208, -155.281719], zoom: 14 },
  { name: "Crater Lake", coord: [42.944695, -122.108147], zoom: 12 },
  { name: "The Great Bend, WA", coord: [47.358338, -123.118856], zoom: 8 },
  { name: "Palouse Farming Country, WA/ID", coord: [46.538175, -117.039979], zoom: 12 },
  { name: "Mt. Chuksan, WA", coord: [48.830100, -121.603026], zoom: 12 },
  { name: "Diablo Lake, WA", coord: [48.715618, -121.121214], zoom: 10 },
  { name: "Bixby Bridge, CA", coord: [36.371488, -121.901530], zoom: 16 },
  { name: "Torrey Pines Golf Course, CA", coord: [32.904750, -117.250990], zoom: 15 },
  { name: "Lassen Peak, CA", coord: [40.486514, -121.506109], zoom: 13 },
  { name: "Lake Tahoe, CA", coord: [38.986424, -120.048984], zoom: 9 },
  { name: "Yosemite Valley, CA", coord: [37.743496, -119.594237], zoom: 13 },
  { name: "Kidney Lake, CA", coord: [37.897758, -119.197783], zoom: 13 },
  { name: "Mt. Whitney, CA", coord: [36.577970, -118.293386], zoom: 9 },
  { name: "Sailing Stones, cA", coord: [36.685018, -117.566196], zoom: 14 },
  { name: "Petrified Forest, AZ", coord: [35.153381, -109.821374], zoom: 10 },
  { name: "Grand Canyon, AZ", coord: [36.099726, -112.105311], zoom: 14 },
  { name: "Monument Valley, AZ/UT", coord: [36.979974, -110.086320], zoom: 16 },
  { name: "Lake Amistad, TX", coord: [29.473507, -101.144195], zoom: 10 },
  { name: "Tooth of Time, NM", coord: [36.447505, -105.000650], zoom: 14 },
  { name: "White Sands, NM", coord: [32.882883, -106.350360], zoom: 9 },
  { name: "Zion Canyon, UT", coord: [37.175529, -113.010749], zoom: 12 },
  { name: "Bryce Canyon, UT", coord: [37.592009, -112.186607], zoom: 13 },
  { name: "Arches National Park, UT", coord: [38.743517, -109.499319], zoom: 20 },
  { name: "Tyndale Glacier, CO", coord: [40.305308, -105.688856], zoom: 15 },
  { name: "Pikes Peak, CO", coord: [38.843457, -105.041110], zoom: 10 },
  {name: "Aspen, CO", coord: [39.192528, -106.870659], zoom: 13 },
  {name: "Grand Teton National Park, WY", coord: [43.740914, -110.802760], zoom: 10 },
  {name: "Devil's Tower, WY", coord: [44.590492, -104.715150], zoom: 17 },
  {name: "Badlands National Monument", coord: [43.674988, -102.412062], zoom: 6},
  {name: "Lake Itasca, MN", coord: [47.218231, -95.205295], zoom: 12},
  {name: "Presque Isle, MI", coord: [45.301598, -83.479333], zoom: 12},
  {name: "Mackincac, MI", coord: [45.816621, -84.727945], zoom: 11},
  {name: "Washburn, WI", coord: [46.669776, -90.890719], zoom: 11},
  {name: "United States Steel Mill, OH", coord: [41.451825, -82.124736], zoom: 15},
  {name: "Gateway Arch, MO", coord: [38.624674, -90.184852], zoom: 17 },
  {name: "Great Smokey Mountains National Park, TN", coord: [35.610656, -83.433273], zoom: 13},
  {name: "Key West, FL", coord: [24.559191, -81.778234], zoom: 12},
  {name: "Miami, FL", coord: [25.845167, -80.120413], zoom: 14},
  {name: "Everglades, FL", coord: [25.262158, -80.981535], zoom: 10},
  {name: "Williamsburg, VA", coord: [37.272295, -76.703638], zoom: 15},
  {name: "Norfolk, VA", coord: [36.925957, -76.326584], zoom: 15},
  {name: "Washington Monument, DC", coord: [38.889514, -77.035452], zoom: 17},
  {name: "Niagra Falls, NY", coord: [43.077532, -79.074846], zoom: 16},
  {name: "Cape Cod, Ma", coord: [41.806065, -69.939503], zoom: 13}
  //END places from Landscapes of America book
]

app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/place', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const chosen = places[Math.floor(Math.random() * places.length)];
  // const chosen = places.at(-1);
  res.end(JSON.stringify(chosen));
  
})



app.get('/tile/:zoom/:x/:y', (req, res) => {
  const x = parseFloat(req.params.x);
  const y = parseFloat(req.params.y);
  const zoom = parseInt(req.params.zoom);


  const url = `https://mt0.google.com/vt/lyrs=s&hl=en&x=${x}&y=${y}&z=${zoom}&s=Ga`

  fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' } }).then((resp) => {
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
  console.log(`Loaded all ${places.length} places`)
})
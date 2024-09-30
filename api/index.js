const express = require('express')
var bodyParser = require('body-parser')
const request = require('request');
const NodeFetchCache = require('node-fetch-cache').NodeFetchCache;
const MemoryCache = require('node-fetch-cache').MemoryCache;
var minify = require('express-minify');

const fetch = NodeFetchCache.create({
  cache: new MemoryCache(),
});

const app = express()
const port = parseFloat(process.argv.at(-1)) || 3000;

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
  { name: "Kilauea, Hawaii", coord: [19.409208, -155.281719], zoom: 14 },
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
  { name: "Aspen, CO", coord: [39.192528, -106.870659], zoom: 13 },
  { name: "Grand Teton National Park, WY", coord: [43.740914, -110.802760], zoom: 10 },
  { name: "Devil's Tower, WY", coord: [44.590492, -104.715150], zoom: 17 },
  { name: "Badlands National Monument", coord: [43.674988, -102.412062], zoom: 6 },
  { name: "Lake Itasca, MN", coord: [47.218231, -95.205295], zoom: 12 },
  { name: "Presque Isle, MI", coord: [45.301598, -83.479333], zoom: 12 },
  { name: "Mackincac, MI", coord: [45.816621, -84.727945], zoom: 11 },
  { name: "Washburn, WI", coord: [46.669776, -90.890719], zoom: 11 },
  { name: "United States Steel Mill, OH", coord: [41.451825, -82.124736], zoom: 15 },
  { name: "Gateway Arch, MO", coord: [38.624674, -90.184852], zoom: 17 },
  { name: "Great Smokey Mountains National Park, TN", coord: [35.610656, -83.433273], zoom: 13 },
  { name: "Key West, FL", coord: [24.559191, -81.778234], zoom: 12 },
  { name: "Miami, FL", coord: [25.845167, -80.120413], zoom: 14 },
  { name: "Everglades, FL", coord: [25.262158, -80.981535], zoom: 10 },
  { name: "Williamsburg, VA", coord: [37.272295, -76.703638], zoom: 15 },
  { name: "Norfolk, VA", coord: [36.925957, -76.326584], zoom: 15 },
  { name: "Washington Monument, DC", coord: [38.889514, -77.035452], zoom: 17 },
  { name: "Niagra Falls, NY", coord: [43.077532, -79.074846], zoom: 16 },
  { name: "Cape Cod, Ma", coord: [41.806065, -69.939503], zoom: 13 },
  //END places from Landscapes of America book

  //START airports
  { name: "KDEN", coord: [39.856120, -104.676363], zoom: 11 },
  { name: "KIAD", coord: [38.951375, -77.456734], zoom: 11 },
  { name: "KORD", coord: [41.977164, -87.905138], zoom: 12 },
  { name: "KDFW", coord: [32.901422, -97.040242], zoom: 12 },
  { name: "KIAH", coord: [29.987071, -95.342269], zoom: 12 },
  { name: "KSFO", coord: [37.618685, -122.381466], zoom: 13 },
  { name: "KMCO", coord: [28.432498, -81.308039], zoom: 12 },
  { name: "KSLC", coord: [40.789598, -111.986876], zoom: 12 },
  { name: "KJFK", coord: [40.644491, -73.779644], zoom: 12 },
  { name: "KDTW", coord: [42.213021, -83.352824], zoom: 12 },
  { name: "KLAX", coord: [33.943980, -118.402944], zoom: 12 },
  { name: "KATL", coord: [33.640894, -84.429300], zoom: 13 },
  { name: "KLAS", coord: [36.084905, -115.151657], zoom: 12 },
  { name: "KCLT", coord: [35.220671, -80.949987], zoom: 13 },
  { name: "KMIA", coord: [25.793379, -80.280183], zoom: 12 },
  { name: "KSEA", coord: [47.449611, -122.306748], zoom: 12 },
  { name: "KEWR", coord: [40.690134, -74.176114], zoom: 13 },
  { name: "KPHX", coord: [33.434916, -112.011602], zoom: 13 },
  { name: "KBOS", coord: [42.366337, -71.010630], zoom: 12 },
  { name: "KFLL", coord: [26.071551, -80.147475], zoom: 13 },
  { name: "KMSP", coord: [44.884802, -93.214121], zoom: 13 },
  { name: "KLGA", coord: [40.779624, -73.874960], zoom: 13 },
  { name: "KPHL", coord: [39.874548, -75.242144], zoom: 12 },
  { name: "KBWI", coord: [39.179392, -76.667598], zoom: 13 },
  { name: "KDCA", coord: [38.850885, -77.040096], zoom: 13 },
  { name: "KSAN", coord: [32.733713, -117.190466], zoom: 13 },
  { name: "KTPA", coord: [27.976648, -82.530300], zoom: 12 },
  { name: "KBNA", coord: [36.123753, -86.677396], zoom: 13 },
  { name: "KAUS", coord: [30.196699, -97.666407], zoom: 13 },
  { name: "KMDW", coord: [41.785597, -87.752084], zoom: 13 },
  { name: "KHNL", coord: [21.315290, -157.926407], zoom: 13 },
  { name: "KANC", coord: [61.176267, -149.991052], zoom: 12 },
  { name: "KVCV", coord: [34.591923, -117.380446], zoom: 12 }
  //END airports
]

app.use(bodyParser.json())
app.use(minify());



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/play.html');
})
app.get('/ads.txt', (req, res) => {
  res.sendFile(__dirname + '/ads.txt');
})

app.get('/place', (req, res) => {
  const exclude = req.query.exclude.split(",") ?? [];
  const to_chose = places.filter((x) => !exclude.includes(btoa(x.name)));

  res.setHeader('Content-Type', 'application/json');
  const chosen = to_chose[Math.floor(Math.random() * to_chose.length)];
  // const chosen = places.at(-1);
  res.end(JSON.stringify(chosen));

})



app.get('/tile/:zoom/:x/:y', (req, res) => {
  const x = parseFloat(req.params.x);
  const y = parseFloat(req.params.y);
  const zoom = parseInt(req.params.zoom);


  const url = `https://mt0.google.com/vt/lyrs=s&hl=en&x=${x}&y=${y}&z=${zoom}&s=Ga`

  fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' } }).then((resp) => {
    if (resp.status === 200) {
      res.set("Content-Type", "image/jpeg");


      resp.blob().then((blob) => {
        blob.arrayBuffer().then((buf) => {
          res.send(Buffer.from(buf))
        })
      });

    }
  })



});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
  console.log(`Loaded all ${places.length} places`)
})
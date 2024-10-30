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
  { name: "Los Angeles, CA", coord: [34, -118], zoom: 10 },
  { name: "New York, NY", coord: [40.780316, -74.012000], zoom: 10 },
  { name: "Yosemite, CA", coord: [37.8651, -119.5383], zoom: 8 },
  { name: "Yellowstone, WY", coord: [44.5979, -110.5612], zoom: 8 },
  { name: "Grand Prismatic Springs, WY", coord: [44.525626, -110.838954], zoom: 17 },
  { name: "Statue of Liberty, NY", coord: [40.691290, -74.047306], zoom: 16 },

  //START places from Landscapes of America book
  { name: "Trunk Bay, St. John, USVI", coord: [18.353863, -64.774272], zoom: 16 },
  { name: "Chugach NF, AK", coord: [61.145252, -147.291878], zoom: 10 },
  { name: "Denali, AK", coord: [63.068571, -151.007126], zoom: 12 },
  { name: "Milolii, HI", coord: [19.185407, -155.906528], zoom: 16 },
  { name: "Laie point,HI", coord: [21.650733, -157.920210], zoom: 14 },
  { name: "Kilauea, HI", coord: [19.409208, -155.281719], zoom: 14 },
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
  { name: "Sailing Stones, CA", coord: [36.685018, -117.566196], zoom: 14 },
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
  { name: "Cape Cod, MA", coord: [41.806065, -69.939503], zoom: 13 },
  //END places from Landscapes of America book

  //START airports
  { name: "Denver International Airport", coord: [39.856120, -104.676363], zoom: 11 },
  { name: "Washington Dulles International Airport", coord: [38.951375, -77.456734], zoom: 11 },
  { name: "Chicago O'Hare International Airport", coord: [41.977164, -87.905138], zoom: 12 },
  { name: "Dallas Fort Worth International Airport", coord: [32.901422, -97.040242], zoom: 12 },
  { name: "George Bush Intercontinental Airport", coord: [29.987071, -95.342269], zoom: 12 },
  { name: "San Francisco International Airport", coord: [37.618685, -122.381466], zoom: 13 },
  { name: "Orlando International Airport", coord: [28.432498, -81.308039], zoom: 12 },
  { name: "Salt Lake City International Airport", coord: [40.789598, -111.986876], zoom: 12 },
  { name: "John F. Kennedy International Airport", coord: [40.644491, -73.779644], zoom: 12 },
  { name: "Detroit Metropolitan Wayne County Airport", coord: [42.213021, -83.352824], zoom: 12 },
  { name: "Los Angeles International Airport", coord: [33.943980, -118.402944], zoom: 12 },
  { name: "Hartsfield-Jackson Atlanta International Airport", coord: [33.640894, -84.429300], zoom: 13 },
  { name: "Harry Reid International Airport", coord: [36.084905, -115.151657], zoom: 12 },
  { name: "Charlotte Douglas International Airport", coord: [35.220671, -80.949987], zoom: 13 },
  { name: "Miami International Airport", coord: [25.793379, -80.280183], zoom: 12 },
  { name: "Seattle-Tacoma International Airport", coord: [47.449611, -122.306748], zoom: 12 },
  { name: "Newark Liberty International Airport", coord: [40.690134, -74.176114], zoom: 13 },
  { name: "Phoenix Sky Harbor International Airport", coord: [33.434916, -112.011602], zoom: 13 },
  { name: "Boston Logan International Airport", coord: [42.366337, -71.010630], zoom: 12 },
  { name: "Fort Lauderdale-Hollywood International Airport", coord: [26.071551, -80.147475], zoom: 13 },
  { name: "Minneapolis-Saint Paul International Airport", coord: [44.884802, -93.214121], zoom: 13 },
  { name: "LaGuardia Airport", coord: [40.779624, -73.874960], zoom: 13 },
  { name: "Philadelphia International Airport", coord: [39.874548, -75.242144], zoom: 12 },
  { name: "Baltimore/Washington International Airport", coord: [39.179392, -76.667598], zoom: 13 },
  { name: "Ronald Reagan Washington National Airport", coord: [38.850885, -77.040096], zoom: 13 },
  { name: "San Diego International Airport", coord: [32.733713, -117.190466], zoom: 13 },
  { name: "Tampa International Airport", coord: [27.976648, -82.530300], zoom: 12 },
  { name: "Nashville International Airport", coord: [36.123753, -86.677396], zoom: 13 },
  { name: "Austin-Bergstrom International Airport", coord: [30.196699, -97.666407], zoom: 13 },
  { name: "Chicago Midway International Airport", coord: [41.785597, -87.752084], zoom: 13 },
  { name: "Daniel K. Inouye International Airport", coord: [21.315290, -157.926407], zoom: 13 },
  { name: "Ted Stevens Anchorage International Airport", coord: [61.176267, -149.991052], zoom: 12 },
  { name: "Southern California Logistics Airport", coord: [34.591923, -117.380446], zoom: 12 },
  //END airports

  // Add custom
  { name: "Outer Banks, NC", coord: [36.090273, -75.704495], zoom: 11 },
  { name: "Bushton, KS", coord: [38.521928, -98.391829], zoom: 11 },
  { name: "Isle Royale, MI", coord: [48.016546, -88.858177], zoom: 9 },
  { name: "Great Salt Lake, UT", coord: [41.196885, -112.559952], zoom: 8 },
  { name: "Catalina Island, CA", coord: [33.381183, -118.415483], zoom: 11 },
  { name: "Craters of the Moon, ID", coord: [43.269289, -113.565021], zoom: 10 },
  { name: "Bald Eagle State Forest, PA", coord: [40.795528, -77.451816], zoom: 9 },
  { name: "Acadia National Park, ME", coord: [44.344444, -68.255498], zoom: 12 },
  { name: "Central Park, NY", coord: [40.781497, -73.968293], zoom: 13 },
  { name: "Telluride, CO", coord: [37.838306, -107.546123], zoom: 9 },
  { name: "Lake Havasu, AZ/CA", coord: [34.484007, -114.382280], zoom: 11 },
  { name: "Glacier, MT", coord: [48.755566, -113.739820], zoom: 12 },
  { name: "New Orleans, LA", coord: [29.931093, -90.149335], zoom: 10 },
  { name: "Twin Falls, ID", coord: [42.549272, -114.283721], zoom: 8 },
  { name: "Wake Island", coord: [19.298632, 166.626125], zoom: 13 },
  { name: "Amarillo, TX", coord: [35.193425, -101.836798], zoom: 11 },
  { name: "Burlington, VT", coord: [44.472372, -73.224245], zoom: 12 },
  { name: "Salt Deposits, OK", coord: [36.800436, -99.255642], zoom: 14 },
  { name: "American Samoa", coord: [-14.231865, -169.464428], zoom: 12 },
  { name: "Razorback Ridge, NV", coord: [36.161564, -114.952700], zoom: 12 },
  { name: "Springfield, IL", coord: [39.782005, -89.654224], zoom: 11 },
  { name: "Oscura Peak, NM", coord: [33.64570125671293, -106.37230247669329], zoom: 8 },
  { name: "Packers, MT", coord: [47.485916403657775, -112.87715308183171], zoom: 8 },
  { name: "Providence, RI", coord: [41.823403561631046, -71.41527022938493], zoom: 13 },
  { name: "Sand Hills, NE", coord: [42.01221699186615, -101.50825724087578], zoom: 9 },
  { name: "Lake Elsinore, CA", coord: [33.65894855975331, -117.3542079945401], zoom: 12 },
  { name: "Ozarks, AR", coord: [35.78165966673931, -93.25231825627677], zoom: 8 },
  { name: "Fargo, ND", coord: [46.84612547084876, -96.84226623686048], zoom: 10 },
  { name: "Cedar Rapaids, IA", coord: [41.9776063058558, -91.67111382748844], zoom: 11 },
  { name: "Daniel Boon NF, KY", coord: [37.13102918008016, -84.10530389031247], zoom: 10 },
  { name: "Indianapolis Speedway, IN", coord: [39.79497753468991, -86.23498209233215], zoom: 14 },
  { name: "Tennesee River, AL", coord: [34.772416735643915, -87.3172653938344], zoom: 9 },
  { name: "Cape Romain, SC", coord: [33.04363721234604, -79.42270370695205], zoom: 11 },
  { name: "Harpers Ferry, WV", coord: [39.33132346288803, -77.75044327804277], zoom: 11 },
  { name: "Norwalk Islands, CT", coord: [41.05681754737773, -73.39827095448827], zoom: 13 },
  { name: "Mt. Washington, NH", coord: [44.270455850077774, -71.30201357921412], zoom: 10 }
]

app.use(bodyParser.json())
app.use(minify());



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/start.html');
})
app.get('/play', (req, res) => {
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

app.get('/geojson', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    type: "FeatureCollection",
    features: places.map(x => ({
      type: "Feature",
      properties: { name: x.name },
      geometry: { type: "Point", coordinates: x.coord.reverse() }
    }))
  }));
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
  console.log(`Loaded all ${places.length} places`)
})
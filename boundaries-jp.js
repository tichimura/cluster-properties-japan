mapboxgl.accessToken = 'pk.eyJ1IjoibG9iZW5pY2hvdSIsImEiOiJjajdrb2czcDQwcHR5MnFycmhuZmo4eWwyIn0.nUf9dWGNVRnMApuhQ44VSw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/tichimura/ck8jc5s6i0e0b1iny1cf144q9',
  center: [139.648890, 35.856940],
  zoom: 5.5
});

// http://www.colorbox.io/
// http://www.colorbox.io/#steps=5#hue_start=311#hue_end=293#hue_curve=easeInQuad#sat_start=4#sat_end=90#sat_curve=easeOutQuad#sat_rate=130#lum_start=100#lum_end=53#lum_curve=easeOutQuad#minor_steps_map=0
const colors = ['#FFF2FD','#FBAEEE','#F76DE1','#E413CD','#BD00BD','#770087','#000000']

var mapping_table = [
  { ID: '1', feature_id: 70258 },
  { ID: '2', feature_id: 135794 },
  { ID: '3', feature_id: 201330 },
  { ID: '4', feature_id: 266866 },
  { ID: '5', feature_id: 332402 },
  { ID: '6', feature_id: 397938 },
  { ID: '7', feature_id: 463474 },
  { ID: '8', feature_id: 529010 },
  { ID: '9', feature_id: 594546 },
  { ID: '10', feature_id: 660082 },
  { ID: '11', feature_id: 725618 },
  { ID: '12', feature_id: 791154 },
  { ID: '13', feature_id: 856690 },
  { ID: '14', feature_id: 922226 },
  { ID: '15', feature_id: 987762 },
  { ID: '16', feature_id: 1053298 },
  { ID: '17', feature_id: 1118834 },
  { ID: '18', feature_id: 1184370 },
  { ID: '19', feature_id: 1249906 },
  { ID: '20', feature_id: 1315442 },
  { ID: '21', feature_id: 1380978 },
  { ID: '22', feature_id: 1446514 },
  { ID: '23', feature_id: 1512050 },
  { ID: '24', feature_id: 1577586 },
  { ID: '25', feature_id: 1643122 },
  { ID: '26', feature_id: 1708658 },
  { ID: '27', feature_id: 1774194 },
  { ID: '28', feature_id: 1839730 },
  { ID: '29', feature_id: 1905266 },
  { ID: '30', feature_id: 1970802 },
  { ID: '31', feature_id: 2036338 },
  { ID: '32', feature_id: 2101874 },
  { ID: '33', feature_id: 2167410 },
  { ID: '34', feature_id: 2232946 },
  { ID: '35', feature_id: 2298482 },
  { ID: '36', feature_id: 2364018 },
  { ID: '37', feature_id: 2429554 },
  { ID: '38', feature_id: 2495090 },
  { ID: '39', feature_id: 2560626 },
  { ID: '40', feature_id: 2626162 },
  { ID: '41', feature_id: 2691698 },
  { ID: '42', feature_id: 2757234 },
  { ID: '43', feature_id: 2822770 },
  { ID: '44', feature_id: 2888306 },
  { ID: '45', feature_id: 2953842 },
  { ID: '46', feature_id: 3019378 },
  { ID: '47', feature_id: 3084914 }
]

map.on('load', () => {

  map.addSource('japandata', {
    'type': 'geojson',
    'data': japandata,
    'cluster': false,
    'clusterRadius': 250,
    'clusterProperties': { // keep separate counts for each fuel category in a cluster
      'counts': ['+', ['get', 'count']]
    }
  });

  map.addSource('boundaries-admin-1', {
    type: 'vector',
    url: 'mapbox://mapbox.boundaries-adm1-v3'
  });

  map.addSource('points-admin-1', {
    type: 'vector',
    url: 'mapbox://mapbox.boundaries-admPoints-v3'
  });

  map.addLayer(
    {
      'id': 'boundaries-admin-1-fill',
      'type': 'fill',
      'source': 'boundaries-admin-1',
      'source-layer': 'boundaries_admin_1',
      'paint': {
        'fill-color':
            ['case',
            ['!=', ['feature-state', 'count'], null],
            [
                'interpolate',
                ['linear'],
                ['feature-state', 'count'],
                0, colors[0],
                50, colors[1],
                100, colors[2],
                500, colors[3],
                1000, colors[4],
                2000, colors[5]],
                colors[0]
            ]
      }
    },
    'water'
  );

  map.setFilter('boundaries-admin-1-fill', ['==', 'iso_3166_1', 'JP'])

  // adding feature-state for joining

  function setStates(e) {
    mapping_table.forEach(function(row){

      map.setFeatureState({
        source: 'boundaries-admin-1',
        sourceLayer: 'boundaries_admin_1',
        id: row.feature_id
      }, {
        count: japandata.features[row.ID-1].properties.count
      });
    });
  }

    // Check if `statesData` source is loaded.
  function setAfterLoad(e) {
    if (e.sourceId === 'boundaries-admin-1' && e.isSourceLoaded) {
      setStates();
      map.off('sourcedata', setAfterLoad);
    }
  }

  // If `statesData` source is loaded, call `setStates()`.
  if (map.isSourceLoaded('boundaries-admin-1')) {
    setStates();
  } else {
    map.on('sourcedata', setAfterLoad);
  }

  // for labeling

  map.addLayer({
    'id': 'circle_each_label',
    'type': 'symbol',
    'source': 'japandata',
    'layout': {
      'text-field': ['to-string', ['concat',['get', 'count'],'\n',['get','prefecture_name_ja']]],
      'text-font': ['Montserrat Bold', 'Arial Unicode MS Bold'],
      'text-size': 13
    },
    'paint': {
      'text-color': colors[6]
    }
  });

  map.setLayerZoomRange('circle_each_label', 6, 22);

  map.addControl(new mapboxgl.NavigationControl());

  // get date and features block from history_data

  var count_date = history.map(function(item){return item.date});
  var count_block = history.map(function(item){return item.counts});

  // sliderbar and show date

  document.getElementById('slider').addEventListener('input', function(e) {

    var currentDate = new Date();
    var startDate = new Date(2020, 0, 16);
    var pastTime = currentDate.getTime() - startDate.getTime();
    var pastDate = Math.ceil(pastTime/(1000*60*60*24)) - 26; // no data for jan/17-28, feb/7,8,10,11
    console.log(pastDate)

    var date_value = parseInt(e.target.value);
    var anumber = pastDate - date_value;
    var date_number = String(count_date[anumber]);
    var date_title = date_number.slice(0,4).concat("/", date_number.slice(4,6).concat("/",date_number.slice(6,8)));

    for( i= 1; i < 48; i++) {

      if ( count_block[anumber][i] ){
        japandata.features[i-1].properties.count = count_block[anumber][i];
      }else{
        japandata.features[i-1].properties.count = 0;
      }
    }

    // updates for datasource

    map.getSource('japandata').setData(japandata);

    // updates for feature-state
    // If `statesData` source is loaded, call `setStates()`.

    if (map.isSourceLoaded('boundaries-admin-1')) {
      setStates();
    } else {
      map.on('sourcedata', setAfterLoad);
    }

    document.getElementById('active-date').innerText = date_title;


  });

});

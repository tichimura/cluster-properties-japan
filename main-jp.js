mapboxgl.accessToken = 'pk.eyJ1IjoibG9iZW5pY2hvdSIsImEiOiJjajdrb2czcDQwcHR5MnFycmhuZmo4eWwyIn0.nUf9dWGNVRnMApuhQ44VSw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/tichimura/ck8jc5s6i0e0b1iny1cf144q9',
  center: [139.648890, 35.856940],
  zoom: 3
});

const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

map.on('load', () => {
  // add a clustered GeoJSON source for powerplant

  map.addSource('japandata', {
    'type': 'geojson',
    'data': japandata,
    'cluster': true,
    'clusterRadius': 200,
    'clusterProperties': { // keep separate counts for each fuel category in a cluster
      'counts': ['+', ['get', 'count']]
    }
  });

  map.addLayer({
    'id': 'circle_cluster',
    'type': 'circle',
    'source': 'japandata',
    'filter': [
      'all',
      ['==', ['get', 'cluster'], true]
    ],
    'paint': {
      'circle-color': 'rgba(0,0,0,.6)',
      'circle-radius': [
        'step',
        ['get', 'counts'],
        10,
        50,
        10,
        100,
        20,
        500,
        30,
        1000,
        50,
        1500,
        75,
        2000,
        100,
        2500,
        150,
        3000,
        200,
        5000,
        500
      ],
      'circle-stroke-color': colors[0],
      'circle-stroke-width': 10
    }
  });

  map.addLayer({
    'id': 'circle_cluster_label',
    'type': 'symbol',
    'source': 'japandata',
    'filter': [
      'all',
      ['==', ['get', 'cluster'], true]
    ],
    'layout': {
      'text-field': ['number-format', ['get', 'counts'], {}],
      'text-font': ['Montserrat Bold', 'Arial Unicode MS Bold'],
      'text-size': 13
    },
    'paint': {
    'text-color': colors[0]
    }
  });

  map.addLayer({
      'id': 'circle_each',
      'type': 'circle',
      'source': 'japandata',
      'filter': [
        'all',
        ['!=', ['get', 'cluster'], true]
      ],
      'paint': {
          'circle-color': 'rgba(0,0,0,.6)',
          'circle-stroke-color': colors[1],
          'circle-stroke-width': 5,
          'circle-radius': [
            'step',
            ['get', 'count'],
            50,
            100,
            100,
            300,
            150,
            750,
            300
          ],
      }
  });

  map.addLayer({
    'id': 'circle_each_label',
    'type': 'symbol',
    'source': 'japandata',
    'filter': [
      'all',
      ['!=', ['get', 'cluster'], true]
    ],
    'layout': {
      'text-field': ['to-string', ['concat',['get', 'count'],'\n',['get','prefecture_name_ja']]],
      'text-font': ['Montserrat Bold', 'Arial Unicode MS Bold'],
      'text-size': 11
    },
    'paint': {
    'text-color': colors[0]
    }
  });

  // get date and features block from history_data

  var count_date = history.map(function(item){return item.date});
  var count_block = history.map(function(item){return item.counts});

  // sliderbar and show date

  document.getElementById('slider').addEventListener('input', function(e) {

    var date_value = parseInt(e.target.value);

    var anumber = 90 - date_value;
    var date_number = String(count_date[anumber]);
    var date_title = date_number.slice(0,4).concat("/", date_number.slice(4,6).concat("/",date_number.slice(6,8)));

    for( i= 1; i < 48; i++) {

      if ( count_block[anumber][i] ){
        japandata.features[i-1].properties.count = count_block[anumber][i];
      }else{
        japandata.features[i-1].properties.count = 0;
      }
    }

    map.getSource('japandata').setData(japandata);
    document.getElementById('active-date').innerText = date_title;


  });

});

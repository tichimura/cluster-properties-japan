mapboxgl.accessToken = 'pk.eyJ1IjoibG9iZW5pY2hvdSIsImEiOiJjajdrb2czcDQwcHR5MnFycmhuZmo4eWwyIn0.nUf9dWGNVRnMApuhQ44VSw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/lobenichou/cjto9zfpj00jq1fs7gajbuaas',
  center: [139.648890, 35.856940],
  zoom: 3
});

const current_fuel = 'hydro'

const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

const hokkaido = ['==', ['get', 'region_name'], 'Hokkaido'];
const tohoku = ['==', ['get', 'region_name'], 'Tohoku'];
const kanto = ['==', ['get', 'region_name'], 'Kanto'];
const chubu = ['==', ['get', 'region_name'], 'Chubu'];
const kansai = ['==', ['get', 'region_name'], 'Kansai'];
const chugoku = ['==', ['get', 'region_name'], 'Chugoku'];
const shikoku = ['==', ['get', 'region_name'], 'Shikoku'];
const kyushu = ['==', ['get', 'region_name'], 'Kyushu'];
const ibaraki = ['==', ['get', 'prefecture_name'], 'Ibaraki'];
const tochigi = ['==', ['get', 'prefecture_name'], 'Tochigi'];
const gunma = ['==', ['get', 'prefecture_name'], 'Gunma'];
const saitama = ['==', ['get', 'prefecture_name'], 'Saitama'];
const chiba = ['==', ['get', 'prefecture_name'], 'Chiba'];
const tokyo = ['==', ['get', 'prefecture_name'], 'Tokyo'];
const kanagawa = ['==', ['get', 'prefecture_name'], 'Kanagawa'];
const others = ['all', ['==', ['get', 'fuel1'], 'Cogeneration'], ['==', ['get', 'fuel1'], 'Storage'], ['==', ['get', 'fuel1'], 'Other'], ['==', ['get', 'fuel1'], 'Wave and Tidel'], ['==', ['get', 'fuel1'], 'Petcoke'], ['==', ['get', 'fuel1'], '']]

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


  // 'Hokkaido': ['+', ['case', hokkaido, ['get', 'count'] , 0]],
  // 'Tohoku': ['+', ['case', tohoku, ['get', 'count'], 0]],
  // 'Kanto': ['+', ['case', kanto, ['get', 'count'], 0]],
  // 'Chubu': ['+', ['case', chubu, ['get', 'count'], 0]],
  // 'Kansai': ['+', ['case', kansai, ['get', 'count'], 0]],
  // 'Chugoku': ['+', ['case', chugoku, ['get', 'count'], 0]],
  // 'Shikoku': ['+', ['case', shikoku, ['get', 'count'], 0]],
  // 'Kyushu': ['+', ['case', kyushu, ['get', 'count'], 0]],

  // 'Ibaraki':['case', ibaraki, ['get', 'count'] , 0],
  // 'Tochigi':['case', tochigi, ['get', 'count'] , 0],
  // 'Gunma':['case', gunma, ['get', 'count'] , 0],
  // 'Saitama':['case', saitama, ['get', 'count'] , 0],
  // 'Tokyo':['case', tokyo, ['get', 'count'] , 0],
  // 'Kanagawa':['case', kanagawa, ['get', 'count'] , 0]


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
        50,
        100,
        100,
        300,
        150,
        750,
        300
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
      'text-field': ['to-string', ['concat',['get', 'count'],'\n',['get','prefecture_name']]],
      'text-font': ['Montserrat Bold', 'Arial Unicode MS Bold'],
      'text-size': 11
    },
    'paint': {
    'text-color': colors[0]
    }
  });

});

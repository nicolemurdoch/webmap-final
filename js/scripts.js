
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xlbXVyZG9jaCIsImEiOiJjanV4MHpkcGkwaTllNDNzMGY1dWM5OXdvIn0.L10-eZL5K7-c8d7WemjfVg';
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/nicolemurdoch/cjvvsrqzq4i9h1cmp3vzt155j',
  center: [-73.884048, 40.728361],
  pitch: 0,
  zoom: 11,
  });

map.scrollZoom.disable();
 // Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl({
  position: 'right-center'
}));

map.on('load', function () {
map.addSource('cycling-weekday-copy', {
type: 'mapboxgl',
url: 'mapbox://styles/nicolemurdoch/cjvvd4qlr43sq1dmobmpoku0m'
});

map.addLayer({
'id': 'weekdaycounts',
'type': 'circle-radius',
'source': 'cycling-weekday-copy',
'layout': {
'visibility': 'visible'
},
'source-layer': 'weekdaycounts'
});

map.addSource('cycling-weekend-copy', {
type: 'vector',
url: 'mapbox://styles/nicolemurdoch/cjvvd7ejs43q81cmppzvg7brw'
});

map.addLayer({
'id': 'weekendcounts',
'type': 'circle-radius',
'source': 'cycling-weekend-copy',
'source-layer': 'weekendcounts',
'layout': {
'visibility': 'visible',
},
});
});

var toggleableLayerIds = [ 'weekdaycounts', 'weekendcounts' ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
var id = toggleableLayerIds[i];

var link = document.createElement('a');
link.href = '#';
link.className = 'active';
link.textContent = id;

link.onclick = function (e) {
var clickedLayer = this.textContent;
e.preventDefault();
e.stopPropagation();

var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

if (visibility === 'visible') {
map.setLayoutProperty(clickedLayer, 'visibility', 'none');
this.className = '';
} else {
this.className = 'active';
map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
}
};

var layers = document.getElementById('menu');
layers.appendChild(link);
}

//sets up the information that will populate in the map's info box when hovering over data points for the weekend volumes
map.on('load', function () {

//separate legend box to display color and size values for the cycling counts displayed on the map
  var layers = ['0-92', '93-200', '201-449', '500-873', '874-1385'];

  var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

  for (i = 0; i < layers.length; i++) {
  var layer = layers[i];
  var color = colors[i];
  var item = document.createElement('div');
  var key = document.createElement('span');
  key.className = 'legend-key';
  key.style.backgroundColor = color;

  var value = document.createElement('span');
  value.innerHTML = layer;
  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
}
});

map.on('mousemove', function(e) {
  var weekdaycounts = map.queryRenderedFeatures(e.point, {
    layers: ['weekdaycounts']
  });
  var weekendcounts = map.queryRenderedFeatures(e.point, {
    layers: ['weekendcounts']
  });

  if (weekdaycounts.length > 0) {
    document.getElementById('pd').innerHTML = '<h3><strong>' + weekdaycounts[0].properties.street + '</strong></h3><p><strong><em>' + weekdaycounts[0].properties.weekday + '</strong> = bicycle counts during 18-hour collection period.</em></p>';
  }
  else if (weekendcounts.length > 0) {
    document.getElementById('pd').innerHTML = '<h3><strong>' + weekendcounts[0].properties.street + '</strong></h3><p><strong><em>' + weekendcounts[0].properties.weekend + '</strong> = bicycle counts during 18-hour collection period.</em></p>';
  }
  else {
    document.getElementById('pd').innerHTML = '<p>Control the weekday and weekend volumes with the buttons above! When either is turned on/activated, hover over a point on the map to get more information about the site location!</p>';
  }
//sets up default cursor to show that there is no further interactivity for the points on the map, just info that populates in side info
  map.getCanvas().style.cursor = 'default';
});

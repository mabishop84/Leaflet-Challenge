//Load API url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  createMarkers(data.features)
});


function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var satellite = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      //call api key from config.js
      accessToken: API_KEY
    });


  var topographical = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });


  // Create a baseMaps object to hold the map layers.
  var baseMaps = {
    "Street Map": streetmap,
    "Topographical Map": topographical,
    Satellite: satellite
  };

  // Create an overlayMaps object to hold the earthquake data layer.
  var overlayMaps = {
    "earthquake": earthquakes
  };

  // Create the map object with options.
  var map = L.map("map", {
    center: [7.9, 14],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

///BONUS ---add tectonic plates layer
  var tectonicPlates = new L.LayerGroup();

  d3.json(
    "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  ).then(function (tectonicPlateData) {
    L.geoJson(tectonicPlateData).addTo(tectonicPlates);
    tectonicPlates.addTo(myMap);
    });

  // Create an overlay object to hold our overlay data.
  var overlayMaps = {

    // Add Tectonic Plates option to the map
    "Tectonic Plates": tectonicPlates,
    Earthquakes: earthquakes,
  };

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
          "red",
          "orange",
          "yellow",
          "green",
          "blue",
          "grey"];
        var labels = [];
    
        var legendInfo = "<h1>Earthquake intensity<h1>" +
          "<div class=\"labels\">" +
          "<div class=\"max\">5+</div>" +
          "<div class=\"fourth\">4-5</div>" +
          "<div class=\"third\">3-4</div>" +
          "<div class=\"second\">2-3</div>" +
          "<div class=\"first\">1-2</div>" +
          "<div class=\"min\">0-1</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        colors.forEach(function (color) {
          labels.push("<li style=\"background-color: " + color + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      }
      legend.addTo(map);
    
    
    }


function createMarkers(earthquakeData) {
  //console.log(earthquakeData)
  var earthquakeMarkers = []


  for (var index = 0; index < earthquakeData.length; index++) {
    var earthquakeCenter = earthquakeData[index]



    var lon = earthquakeCenter.geometry.coordinates[0]
    var lat = earthquakeCenter.geometry.coordinates[1]
    var mag = earthquakeCenter.properties.mag
    var place = earthquakeCenter.properties.place




    function markerColor(mag) {
      if (mag <= 1) {
        return "grey";
      } else if (mag <= 2) {
        return "blue";
      } else if (mag <= 3) {
        return "green";
      } else if (mag <= 4) {
        return "yellow";
      } else if (mag <= 5) {
        return "orange";
      } else {
        return "red"
      }
    }

    var earthquakeMarker = L.circle([lat, lon], {
      color: markerColor(mag),
      fillColor: markerColor(mag),
      fillOpacity: 0.75,
      radius: (mag * 25000)
    })
      .bindPopup("<h3> Place:" + place + "<h3><h3>Magnitude: " + mag + "</h3>");

    earthquakeMarkers.push(earthquakeMarker);
  }
  createMap(L.layerGroup(earthquakeMarkers))
}
  // var earthquakes = L.geoJSON(earthquakeData, {
  //       pointToLayer: function(earthquakeData, latlng) {
  //       return L.circle(latlng, {
  //           radius: radiusSize(earthquakeData.properties.mag),
  //           color: circleColor(earthquakeData.properties.mag),
  //           });
  //   },
    // onEachFeature: onEachFeature
 // });
// createMap(earthquakes)
//} 

  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.


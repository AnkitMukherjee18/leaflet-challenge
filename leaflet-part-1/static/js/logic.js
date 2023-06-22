// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Create the map
    var myMap = L.map("map").setView([37.09, -95.71], 3);
  
    // Create the tile layer for the map background
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
        maxZoom: 18,
      }
    ).addTo(myMap);
  
    // Fetch the earthquake data
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Process the earthquake data
        processData(data.features);
      });
  
    // Function to process the earthquake data
    function processData(earthquakes) {
      // Loop through each earthquake
      earthquakes.forEach(function (earthquake) {
        // Get the magnitude and depth of the earthquake
        var magnitude = earthquake.properties.mag;
        var depth = earthquake.geometry.coordinates[2];
  
        // Create a circle marker for the earthquake
        var circle = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
          radius: magnitude * 20000, // Adjust the scaling factor for marker size
          color: "black",
          fillColor: getColor(depth),
          fillOpacity: 0.8,
        }).addTo(myMap);
  
        // Add a popup with additional information
        circle.bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`);
      });
  
      // Create the legend
      var legend = L.control({ position: "bottomright" });
  
      legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend");
  
        var depths = [0, 10, 30, 50, 70, 90];
        var colors = ["#00FF00", "#ADFF2F", "#FFFF00", "#FFA500", "#FF4500", "#FF0000"];
  
        for (var i = 0; i < depths.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            colors[i] +
            '"></i> ' +
            depths[i] +
            (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
  
        return div;
      };
  
      legend.addTo(myMap);
    }
  
    // Function to determine the color based on depth
    function getColor(depth) {
      if (depth < 10) {
        return "#00FF00";
      } else if (depth < 30) {
        return "#ADFF2F";
      } else if (depth < 50) {
        return "#FFFF00";
      } else if (depth < 70) {
        return "#FFA500";
      } else if (depth < 90) {
        return "#FF4500";
      } else {
        return "#FF0000";
      }
    }
  });
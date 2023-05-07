document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("load", function () {
    const form = document.getElementById("routeForm");
    //   let mymap;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const refreshBtn = document.getElementById("refresh-btn");
      refreshBtn.addEventListener("click", function () {
        location.reload();
      });
      const geocodingEndpoint =
        "https://api.openrouteservice.org/geocode/search";
      var geocodeUrl =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token=sk.eyJ1IjoicHJpeWExNjYwMyIsImEiOiJjbGd3aHR3c3UwMXRhM2dta214djNpZG1iIn0.SzY5gqnpXq1lSncyIO0s7g";
      const directionsEndpoint =
        "https://api.openrouteservice.org/v2/directions/driving-car";

      const api_key =
        "5b3ce3597851110001cf6248fe80dd08a00b49e3846881f77df12e9f";
      const weather_api_key = "";

      const src = document.getElementById("src").value;
      const dst = document.getElementById("dst").value;

      const WEATHER_ICONS = {
        'clear-day': '☀️',
        'clear-night': '🌙',
        'rain': '🌧️',
        'snow': '❄️',
        'sleet': '🌨️',
        'wind': '💨',
        'fog': '🌫️',
        'haze': '🌁',
        'few-clouds': '🌤️',
        'scattered-clouds': '⛅',
        'cloudy': '☁️',
        'partly-cloudy-day': '🌤️',
        'partly-cloudy-night': '☁️🌙',
      };
      
      function getWeatherIcon(condition, description) {
        if (condition in WEATHER_ICONS) {
          return WEATHER_ICONS[condition];
        } else {
          // Map weather descriptions to icons
          if (description.includes('clear')) {
            return '☀️';
          } else if (description.includes('rain') || description.includes('drizzle')) {
            return '🌧️';
          } else if (description.includes('snow')) {
            return '❄️';
          } else if (description.includes('sleet')) {
            return '🌨️';
          } else if (description.includes('wind')) {
            return '💨';
          } else if (description.includes('fog') || description.includes('mist')) {
            return '🌫️';
          } else if (description.includes('haze')) {
            return '🌁';
          } else if (description.includes('few clouds')) {
            return '🌤️';
          } else if (description.includes('scattered clouds') || description.includes('broken clouds')) {
            return '⛅';
          } else if (description.includes('overcast')) {
            return '☁️';
          } else {
            return '❓';
          }
        }
      }
      

      const srcParams = {
        api_key: api_key,
        text: src,
      };

      const dstParams = {
        api_key: api_key,
        text: dst,
      };

      axios
        .get(geocodingEndpoint, { params: srcParams })
        .then((srcResponse) => {
          const srcData = srcResponse.data;
          const srcCoordinates = srcData.features[0].geometry.coordinates;
          srcLng = srcCoordinates[0];
          srcLat = srcCoordinates[1];

          axios
            .get(geocodingEndpoint, { params: dstParams })
            .then((dstResponse) => {
              const dstData = dstResponse.data;
              const dstCoordinates = dstData.features[0].geometry.coordinates;
              dstLng = dstCoordinates[0];
              dstLat = dstCoordinates[1];

              const params = {
                api_key: api_key,
                start: `${srcLng},${srcLat}`,
                end: `${dstLng},${dstLat}`,
                preference: "safety",
              };
              axios
                .get(directionsEndpoint, { params })
                .then((response) => {
                  const data = response.data;
                  const safest_route = data.features[0].properties.segments;
                  console.log("The safest route is:", safest_route);
                  const instructions = safest_route[0].steps.map((step) => {
                    const name = step.name;
                    const instruction = step.instruction;
                    const location = step.maneuver
                      ? step.maneuver.location
                      : null; // add a check for maneuver property
                    return { name, instruction, location };
                    //   return { name, instruction };
                  });

                  const instructionsContainer =
                    document.getElementById("instruction");
                  instructionsContainer.innerHTML = "";
                  const table = document.createElement("table");
                  const tableHead = document.createElement("thead");
                  const tableBody = document.createElement("tbody");
                  const tableHeadRow = document.createElement("tr");
                  const tableHeadCol1 = document.createElement("th");
                  tableHeadCol1.innerHTML = "Step Number";
                  const tableHeadCol2 = document.createElement("th");
                  tableHeadCol2.innerHTML = "Place";
                  const tableHeadCol3 = document.createElement("th");
                  tableHeadCol3.innerHTML = "Instruction";
                  tableHeadRow.appendChild(tableHeadCol1);
                  tableHeadRow.appendChild(tableHeadCol2);
                  tableHeadRow.appendChild(tableHeadCol3);
                  tableHead.appendChild(tableHeadRow);

                  // Create table body
                  instructions.forEach((step, index) => {
                    const row = document.createElement("tr");
                    const col1 = document.createElement("td");
                    col1.innerHTML = index + 1;
                    const col2 = document.createElement("td");
                    col2.innerHTML = step.name;
                    const col3 = document.createElement("td");
                    col3.innerHTML = step.instruction;
                    row.appendChild(col1);
                    row.appendChild(col2);
                    row.appendChild(col3);
                    tableBody.appendChild(row);
                  });

                  // Append table to container
                  table.appendChild(tableHead);
                  table.appendChild(tableBody);
                  instructionsContainer.appendChild(table);

                  const mapContainer = document.getElementById("mapid");
                  const mymap = L.map("mapid").setView([srcLat, srcLng], 13);

                  const tileLayer = L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                      attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                      maxZoom: 18,
                    }
                  );
                  tileLayer.addTo(mymap);

                  // Add the route to the map
                  L.geoJSON(safest_route[0].geometry, {
                    style: { color: "blue" },
                  }).addTo(mymap);
                  mymap.on("click", function (e) {
                    // Fetch weather data
                    var weatherUrl =
                      "https://api.openweathermap.org/data/2.5/weather?lat=" +
                      e.latlng.lat +
                      "&lon=" +
                      e.latlng.lng +
                      "&appid=81566298f00aa426888381172b2edcb9";
                    $.getJSON(weatherUrl, function (data) {
                      // Extract relevant weather information
                      var weatherDescription = data.weather[0].description;
                      var temperature = data.main.temp;
                      var humidity = data.main.humidity;
                      var windSpeed = data.wind.speed;
                      const currentWeather = "haze";
                      const currentWeatherIcon = getWeatherIcon(currentWeather);

                      var popupContent = "<div style='width: 200px; height: 100px; font-size: 18px;'>" +
                      currentWeatherIcon +
                      "Weather: " +
                      weatherDescription +
                      "<br>" +
                      "Temperature: " +
                      temperature +
                      "°K<br>" +
                      "Humidity: " +
                      humidity +
                      "%<br>" +
                      "Wind Speed: " +
                      windSpeed +
                      " m/s" +
                      "</div>";

                      // Create a marker with a popup
                      const popup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(popupContent)
                        .openOn(mymap);

                      
                    });
                  });

                  // Add markers for source and destination
                  L.marker([srcLat, srcLng]).addTo(mymap);
                  L.marker([dstLat, dstLng]).addTo(mymap);

                  const bounds = new L.LatLngBounds(
                    new L.LatLng(srcLat, srcLat),
                    new L.LatLng(dstLat, dstLng)
                  );

                  const sourceDestLine = [
                    [srcLat, srcLng],
                    [dstLat, dstLng],
                  ];

                  const lineStyle = { color: "red" };
                  const line = L.polyline(sourceDestLine, lineStyle).addTo(
                    mymap
                  );
                  // Fit the map to the route
                  mymap.fitBounds(bounds);
                })
                .catch((error) => {
                  console.error("Failed to get safest route:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to geocode destination:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to geocode source:", error);
        });
    });
  });
});

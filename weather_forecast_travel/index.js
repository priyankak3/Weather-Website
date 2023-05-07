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
      
      const selectedMode = document.getElementById("mode").value;

      const geocode_endpoint = 'https://api.opencagedata.com/geocode/v1/json';
      const api_key ="5b3ce3597851110001cf6248fe80dd08a00b49e3846881f77df12e9f";
      const weather_api_key = "81566298f00aa426888381172b2edcb9";

      const src = document.getElementById("src").value;
      const dst = document.getElementById("dst").value;

      const apiKey = 'd8d43c02e08041d7863c171ec248e2ca'; // Replace with your API key from OpenCage

      const WEATHER_ICONS = {
        "clear-day": "☀️",
        "clear-night": "🌙",
        rain: "🌧️",
        snow: "❄️",
        sleet: "🌨️",
        wind: "💨",
        fog: "🌫️",
        haze: "🌁",
        "few-clouds": "🌤️",
        "scattered-clouds": "⛅",
        cloudy: "☁️",
        "partly-cloudy-day": "🌤️",
        "partly-cloudy-night": "☁️🌙",
      };

      function getWeatherIcon(condition, description) {
        if (condition in WEATHER_ICONS) {
          return WEATHER_ICONS[condition];
        } else {
          // Map weather descriptions to icons
          if (description.includes("clear")) {
            return "☀️";
          } else if (
            description.includes("rain") ||
            description.includes("drizzle")
          ) {
            return "🌧️";
          } else if (description.includes("snow")) {
            return "❄️";
          } else if (description.includes("sleet")) {
            return "🌨️";
          } else if (description.includes("wind")) {
            return "💨";
          } else if (
            description.includes("fog") ||
            description.includes("mist")
          ) {
            return "🌫️";
          } else if (description.includes("haze")) {
            return "🌁";
          } else if (description.includes("few clouds")) {
            return "🌤️";
          } else if (
            description.includes("scattered clouds") ||
            description.includes("broken clouds")
          ) {
            return "⛅";
          } else if (description.includes("overcast")) {
            return "☁️";
          } else {
            return "❓";
          }
        }
      }

      const src_params = {
        key: apiKey,
        q: src,
        limit: 1
        };

      const dstParams = {
        key: apiKey,
        q: dst,
        limit: 1
      };
var srcLat,srcLng,dstLat,dstLng;
      axios.get(geocode_endpoint, { params: src_params })
      .then((src_response) => {
      const src_data = src_response.data;
      srcLat = src_data.results[0].geometry.lat;
      srcLng= src_data.results[0].geometry.lng;

      axios.get(geocode_endpoint, { params: dstParams })
      .then((dst_response) => {
        const dst_data = dst_response.data;
        dstLat = dst_data.results[0].geometry.lat;
        dstLng = dst_data.results[0].geometry.lng;
    
        // Get the route between the source and destination cities using OpenRouteService API
        const route_endpoint = `https://api.openrouteservice.org/v2/directions/${selectedMode}`;;
        const route_params = {
          api_key: '5b3ce3597851110001cf6248fe80dd08a00b49e3846881f77df12e9f',
          start: `${srcLng},${srcLat}`,
          end: `${dstLng},${dstLat}`
        };
        axios.get(route_endpoint, { params: route_params })
        .then((route_response) => {
          const route_data = route_response.data;
          const safest_route = route_data.features[0].properties.segments;
          console.log('The safest route is:'+safest_route);
          const coordinates = route_data.features[0].geometry.coordinates;
          console.log(coordinates);
          const instructions = safest_route[0].steps.map((step, index) => {
            const name = step.name;
            const instruction = step.instruction;
            const location = step.maneuver ? step.maneuver.location : null; 
            return { name, instruction, location, index };
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

                  L.Routing.control({
                    waypoints: [
                      L.latLng(srcLat, srcLng),
                      L.latLng(dstLat, dstLng),
                    ],
                    lineOptions: {
                                styles: [{ color: "blue", weight: 3 }],
                              },
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
                      var weatherDescription = data.weather[0].description;
                      var temperature = data.main.temp;
                      temperature-=273;
                      var humidity = data.main.humidity;
                      var windSpeed = data.wind.speed;
                      const currentWeather = "haze";
                      const currentWeatherIcon = getWeatherIcon(currentWeather);

                      var popupContent =
                        "<div style='width: 200px; height: 100px; font-size: 18px;'>" +
                        currentWeatherIcon +
                        "Weather: " +
                        weatherDescription +
                        "<br>" +
                        "Temperature: " +
                        temperature.toPrecision(4)+
                        "°C<br>" +
                        "Humidity: " +
                        humidity +
                        "%<br>" +
                        "Wind Speed: " +
                        windSpeed +
                        " m/s <br>" +
                        "</div>";

                      const popup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(popupContent)
                        .openOn(mymap);
                    });
                  });
                  featureGroup = L.featureGroup().addTo(mymap);
                  var marker1 = L.marker([srcLat,srcLng]).addTo(mymap);
                  var marker2 = L.marker([dstLat, dstLng]).addTo(mymap);
                  var marker;
                  
                  mymap.on("click", function (e) {
                    if(marker) {
                      mymap.removeLayer(marker)
                    }
                });

                  featureGroup.addLayer(marker1);
                  featureGroup.addLayer(marker2);
                  mymap.fitBounds(featureGroup.getBounds());
                  
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

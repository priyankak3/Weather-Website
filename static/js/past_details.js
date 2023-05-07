const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
   da=document.getElementById("d"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIcon = document.getElementById("icon"),
  currentLocation = document.getElementById("location"),
  searchForm = document.querySelector("#search"),
  datest = document.querySelector("#datestart"),
  search = document.querySelector("#query"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  pstbtn = document.querySelector("#past_d")
  weatherCards = document.querySelector("#weather-cards");
  visibilityStatus = document.querySelector(".cond");

let currentCity = "";
let currentUnit = "c";
let todaydate="";

// function to get date and time
function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // 12 hours format
  hour = hour % 12;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  const time = new Date();
  const month = time.getMonth();
  const dt = time.getDate();
  setInnerText('d', dt+ ' ' + months[month]);
  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute}`;
}

const setInnerText = (id, text) =>{
    document.getElementById(id).innerText = text;
}

//Updating date and time
date.innerText = getDateTime();
setInterval(() => {
  
  date.innerText = getDateTime();

}, 1000);

// function to get public ip address


// function to get weather data
function getWeatherData(city, unit) {
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=NQ2JP7DES4XXBYM6PSLVXL2RY&contentType=json`,
      {
        method: "GET",
        headers: {},
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        let today = data.currentConditions;
        if (unit == "c") {
          temp.innerText = today.temp;
        } else {
          temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        todaydate=data.days[0].datetime;
        condition.innerText = today.conditions;
        rain.innerText = "Rain Perc - " + today.precip + "%";
        let lat=data.latitude;
        let lon=data.longitude;
        let add=data.address;
        mainIcon.src = getIcon(today.icon);
        searchPastCity(add);
        changeBackground(today.icon);
        getWeeklyData(add);
        
        
      })
    //   .catch((err) => {
    //     alert("City not found in our database");
    //   });
  }
  

  // function to change weather icons
  function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
      return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
      return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
      return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
      return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
      return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
      return "https://i.ibb.co/rb4rrJL/26.png";
    }
  }
  
  // function to change background depending on weather conditions
  function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
      bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    } else if (condition === "partly-cloudy-night") {
      bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
    } else if (condition === "rain") {
      bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
    } else if (condition === "clear-day") {
      bg = "https://i.ibb.co/WGry01m/cd.jpg";
    } else if (condition === "clear-night") {
      bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
    } else {
      bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    }
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
  }
  
  //get hours from hh:mm:ss
  function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
      hour = hour - 12;
      return `${hour}:${min} PM`;
    } else {
      return `${hour}:${min} AM`;
    }
  }
  
  // convert time to 12 hour format
  function covertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
  }
  
  // function to get day name from date
  function getDayName(date) {
    let day = new Date(date);
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day.getDay()];
  }



  
  // function to handle search form
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
      currentCity = location;
      getWeatherData(location, currentUnit);
    }
    // searchPastCity(location);
  });
  
  // function to conver celcius to fahrenheit
  function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
  }
  
  
  
  fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
  });
  celciusBtn.addEventListener("click", () => {
    changeUnit("c");
  });
  
  // function to change unit
  function changeUnit(unit) {
    if (currentUnit !== unit) {
      currentUnit = unit;
      // getWeatherData(currentCity, unit);
      tempUnit.forEach((elem) => {
        elem.innerText = `°${unit.toUpperCase()}`;
      });
      if (unit === "c") {
        celciusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
      } else {
        celciusBtn.classList.remove("active");
        fahrenheitBtn.classList.add("active");
      }
      getWeatherData(currentCity, currentUnit);
    }
  }
  
//   hourlyBtn.addEventListener("click", () => {
//     changeTimeSpan("hourly");
//   });
//   weekBtn.addEventListener("click", () => {
//     changeTimeSpan("week");
//   });
//   pollBtn.addEventListener("click", () => {
//     changeTimeSpan("poll");
//   });
//   pastBtn.addEventListener("click", () => {
//     changeTimeSpan("past");
//   });




var lat = window.localStorage.getItem("lat");
      var lon = window.localStorage.getItem("lon");
      console.log(lat);
      console.log(lon);
      
      var City = window.localStorage.getItem("citypass");
      console.log(City);

getWeatherData(City, currentUnit);

function updateHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}
const searchPastCity = (CityN) => {
    const st = document.getElementById('std').value;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${st}&endDateTime=${st}&unitGroup=uk&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${CityN}&key=NQ2JP7DES4XXBYM6PSLVXL2RY`;
   
    fetch(url)
        .then(res => res.json())
        .then(data => displayPast(data));
  }

const searchPast = () => {
    const st = document.getElementById('std').value;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${st}&endDateTime=${st}&unitGroup=uk&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${City}&key=NQ2JP7DES4XXBYM6PSLVXL2RY`;
   
    fetch(url)
        .then(res => res.json())
        .then(data => displayPast(data));
  }
  function updateVisibiltyStatus(visibility) {
    if (visibility <= 0.03) {
      visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 0.16) {
      visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
      visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
      visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
      visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
      visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
      visibilityStatus.innerText = "Clear Air";
    } else {
      visibilityStatus.innerText = "Very Clear Air";
    }
  }
  
  const displayPast = data => {
    console.log(data);
    
      City= Object.keys(data.locations)[0];
      setInnerText('maxt', data.locations[City].values[0].maxt);
setInnerText('mint', data.locations[City].values[0].mint);
      setInnerText('tem', data.locations[City].values[0].temp);
      setInnerText('humid', data.locations[City].values[0].humidity);
      
      setInnerText('condi', data.locations[City].values[0].visibility);
      setInnerText('speed', data.locations[City].values[0].wspd);
      updateVisibiltyStatus(data.locations[City].values[0].visibility);
      //document.getElementById("condition").innerHTML=data.locations[City].values[0].conditions;
      //setInnerText('condition',data.locations[City].values[0].conditions);
    
     
    // setInnerText('lon', temperature.lon);
  } 

   pstbtn.addEventListener("click", () => {
     searchPastCity(City);
   });

   function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

   function getWeeklyData(City){
    const apiKey = "NQ2JP7DES4XXBYM6PSLVXL2RY";
    const chartElement = document.getElementById("hourlyWeatherChart");
    const todayDate = new Date();
  let ed = new Date(todayDate.getTime() ); // End date is yesterday
  let st = new Date(ed.getTime() - (14 * 24 * 60 * 60 * 1000));
 
  st = formatDate(st);
  ed= formatDate(ed);
  console.log(st);
  console.log(ed);
    const chart = Chart.getChart(chartElement);
    if (chart) {
        chart.destroy();
    }
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${st}&endDateTime=${ed}&unitGroup=uk&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${City}&key=NQ2JP7DES4XXBYM6PSLVXL2RY`, {
        method: "GET",
        headers: {}
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      
        const weeklyData = data.locations[City].values;
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labels = weeklyData.map(day => {
      const date = new Date(day.datetime);
      const weekday = weekdays[date.getUTCDay()];
      const dayOfMonth = date.getUTCDate();
      const month = date.getUTCMonth() + 1; 
      return `${weekday} (${dayOfMonth}/${month})`;
  });
        
  
        const temperatures = weeklyData.map(day => day.temp);
        const precipitation = weeklyData.map(day => day.precip);
  
        new Chart(document.getElementById("hourlyWeatherChart"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Average Temperature (°C)",
                    data: temperatures,
                    fill: false,
                    borderColor: "rgba(75, 192, 192, 1)"
                }, {
                    label: "Precipitation (mm)",
                    data: precipitation,
                    fill: false,
                    borderColor: "rgba(255, 99, 132, 1)"
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching weather data:', error));
  }

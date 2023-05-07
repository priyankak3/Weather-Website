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
  weatherCards = document.querySelector("#weather-cards");

let currentCity = "";
let currentUnit = "c";

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
        if (unit === "c") {
          temp.innerText = today.temp;
        } else {
          temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = "Rain Perc - " + today.precip + "%";
        let lat=data.latitude;
        let lon=data.longitude;
        mainIcon.src = getIcon(today.icon);
        searchPollution(lat,lon);
        changeBackground(today.icon);
        
        
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


  function updateCOStatus(visibility) {
    if (visibility <= 4400) {
      document.getElementById("co-l").innerText = "Good";
    } else if (visibility <= 9400) {
      document.getElementById("co-l").innerText = "Fair";
    } else if (visibility <=12400) {
      document.getElementById("co-l").innerText = "Moderate";
    } else if (visibility <= 15400) {
      document.getElementById("co-l").innerText = "Poor";
    } else {
      document.getElementById("co-l").innerText = "Very Poor";
    }
  }
  
  function updateOZStatus(visibility) {
    if (visibility <= 60) {
      document.getElementById("oz-l").innerText = "Good";
    } else if (visibility <= 100) {
      document.getElementById("oz-l").innerText = "Fair";
    } else if (visibility <=140) {
      document.getElementById("oz-l").innerText = "Moderate";
    } else if (visibility <= 180) {
      document.getElementById("oz-l").innerText = "Poor";
    } else {
      document.getElementById("oz-l").innerText = "Very Poor";
    }
  }

  function updateSO2Status(visibility) {
    if (visibility <= 20) {
      document.getElementById("so2-l").innerText = "Good";
    } else if (visibility <= 80) {
      document.getElementById("so2-l").innerText = "Fair";
    } else if (visibility <=250) {
      document.getElementById("so2-l").innerText = "Moderate";
    } else if (visibility <= 350) {
      document.getElementById("so2-l").innerText = "Poor";
    } else {
      document.getElementById("so2-l").innerText = "Very Poor";
    }
  }

  

  function updateNO2Status(visibility) {
    if (visibility <= 40) {
      document.getElementById("no2-l").innerText = "Good";
    } else if (visibility <= 70) {
      document.getElementById("no2-l").innerText = "Fair";
    } else if (visibility <=150) {
      document.getElementById("no2-l").innerText = "Moderate";
    } else if (visibility <= 200) {
      document.getElementById("no2-l").innerText = "Poor";
    } else {
      document.getElementById("no2-l").innerText = "Very Poor";
    }
  }



  // function to handle search form
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
      currentCity = location;
      getWeatherData(location, currentUnit);
    }
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
      getWeatherData(currentCity, unit);
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




const searchPollution = (lat,lon) => {
    const API ='c5de59614782143f08cc9ea068bbd5a2';
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayPollution(data));
}

const displayPollution = temperature => {
    console.log(temperature)
   
     setInnerText('co', temperature.list[0].components.co);
     updateCOStatus(temperature.list[0].components.co);
     setInnerText('oz', temperature.list[0].components.o3);
     updateOZStatus(temperature.list[0].components.o3);
     setInnerText('so2', temperature.list[0].components.so2);
     updateSO2Status(temperature.list[0].components.so2);
     setInnerText('no', temperature.list[0].components.no);
     setInnerText('no2', temperature.list[0].components.no2);
     updateNO2Status(temperature.list[0].components.no2)
     setInnerText('nh3', temperature.list[0].components.nh3);
    // setInnerText('lon', temperature.lon);
}

var lat = window.localStorage.getItem("lat");
      var lon = window.localStorage.getItem("lon");
      console.log(lat);
      console.log(lon);
      
      var City = window.localStorage.getItem("citypass");
      console.log(City);

getWeatherData(City, currentUnit);


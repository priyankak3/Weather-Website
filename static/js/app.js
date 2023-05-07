
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    setInnerText('time',(hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+' '+ampm ); 
    
    setInnerText('date', days[day] + ', ' + date+ ' ' + months[month]);

}, 10);

const currentButton = document.getElementById("current-button");
          currentButton.addEventListener("click", getPublicIp);
const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';
// let lat=123;
// let lon=456;

const searchTemperature = () => {
    const city = document.getElementById('query').value;
    window.localStorage.setItem("citypass",city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayTemperature(data));
}

const setInnerText = (id, text) =>{
    document.getElementById(id).innerText = text;
}

function getPublicIp() {
    fetch("http://ip-api.com/json", {
      method: "GET",
      headers: {},
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setInnerText('city', data.city);
        setInnerText('country', data.country);
        currentCity = data.city;
        var lat=data.lat;
        var lon=data.lon;
        
        window.localStorage.setItem("citypass",currentCity);
        window.localStorage.setItem("lat",lat);
        window.localStorage.setItem("lon",lon);
        console.log(lat);
        console.log(lon);
        // sessionStorage.setItem("currenCity", currentCity);
        
        
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayTemperature(data));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  

  const displayTemperature = temperature => {
    console.log(temperature);
    setInnerText('city', temperature.name);
    setInnerText('country', temperature.sys.country);
    let temperatureValue = temperature.main.temp;
    let lat = temperature.coord.lat;
    let lon = temperature.coord.lon;
    if (temperature.name === "Mumbai") {
        const predictionUrl = "/get-prediction";
        fetch(predictionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                max_temperature: temperature.main.temp_max,
                min_temperature: temperature.main.temp_min,
            })
        })
        .then(res => res.json())
        .then(data => {
            temperatureValue = data.prediction;
            setInnerText('temp', temperatureValue);
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        setInnerText('temp', temperatureValue);
    }
    window.localStorage.setItem("lat",lat);
    window.localStorage.setItem("lon",lon);
    console.log(lat);
    console.log(lon);
}




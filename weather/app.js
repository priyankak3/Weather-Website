
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

}, 1);


const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';
// let lat=123;
// let lon=456;

const searchTemperature = () => {
    const city = document.getElementById('inputcity').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayTemperature(data));
}

const setInnerText = (id, text) =>{
    document.getElementById(id).innerText = text;
}


const displayTemperature = temperature => {
    console.log(temperature);
    setInnerText('city', temperature.name);
    setInnerText('temp', temperature.main.temp);
    setInnerText('weather', temperature.weather[0].main);
    setInnerText('temp_min', temperature.main.temp_min);
    setInnerText('temp_max', temperature.main.temp_max);
    let lat=temperature.coord.lat;
    let lon=temperature.coord.lon;
   searchPollution(lat,lon);
    // weather icon settings 
   /* const url = ` http://openweathermap.org/img/wn/${temperature.weather[0].icon}@2x.png`;
    const imgIcon = document.getElementById('image-icon');
    imgIcon.setAttribute('src', url);*/
}

const searchPollution = (lat,lon) => {
    const API ='c5de59614782143f08cc9ea068bbd5a2';
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayPollution(data));
}

const displayPollution = temperature => {
    console.log(temperature);
     setInnerText('co', temperature.list[0].components.co);
     setInnerText('oz', temperature.list[0].components.o3);
     setInnerText('so2', temperature.list[0].components.so2);
    // setInnerText('lon', temperature.lon);
}
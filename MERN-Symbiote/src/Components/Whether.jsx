import React, { useState } from 'react';

export default function App() {
  const apiKey = "9d8a6a9c6fa76d30e6819be47bf50d58";
  const city = "Auckland"; // Use the city name as a variable

  const [count, setCount] = useState(" "); 
  const handleClick = () => {
    setCount("");
  }

  // Construct the API URL with the API key and city name
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  async function checkWeather() {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log(data);

      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".temp").innerHTML = data.main.temp + "°C";
      document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
      document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
  }
  
  checkWeather();
 
  return (
    <div className="card">
        <div className="search">
            <input type="text" placeholder="Search" spellCheck='false' />
            <button handleClick = {handleClick}><img src="images/search.png"/></button>
        </div>
        <div className="weather">
          <img src="images/rain.png" className='weather icon' ></img>
          <h1 className='temp'>19°C</h1>
          <h2 className='city'>Auckland</h2>
          <div className="details">
            <img src="./images/humidity.png"></img>
            <div>
              <p className='humidity'>56%</p>
              <p>Humidity</p>
            </div>
            <div className="col">
              <img src="./images/wind.png"></img>
              <div>
                <p className='wind'>18 km/h</p>
                <p>Wind</p>
            </div>
            </div>
          </div>
        </div>
    </div>
  )
}

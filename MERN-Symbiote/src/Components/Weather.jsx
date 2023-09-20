import React, { useState } from 'react';

const apiKey = "9d8a6a9c6fa76d30e6819be47bf50d58";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(apiURL + city + `&appid=${apiKey}`);
      const data = await response.json();
      console.log(data);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="card">
      <h1>Weather</h1>
      <br></br>
      <div className="search">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Search</button>
      </div>
      {weatherData && (
        <div className="weather">
          <img src="images/rain.png" className="weather-icon" alt="Weather Icon" />
          <h1 className="temp">{weatherData.main.temp}°C</h1>
          <h2 className="city">{weatherData.name}</h2>
          <div className="details">
            <div className="col">
              <img src="./images/humidity.png" alt="Humidity Icon" />
              <div>
                <p className="humidity">{weatherData.main.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="col">
              <img src="./images/wind.png" alt="Wind Icon" />
              <div>
                <p className="wind">{weatherData.wind.speed} km/h</p>
                <p>Wind</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
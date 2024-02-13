import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface IWeather {
  temp: number;
  feels_like: number;
  main: string;
  wind: string;
}

interface IForecast {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const Home: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [currentData, setCurrentData] = useState<IWeather | null>(null);
  const [forecastData, setForecastData] = useState<IForecast[] | null>(null);

  const apiKey = "99873c3b1d75c5ae62ea9b0aac9dee01";

  const fetchWeatherData = async () => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${apiKey}`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get<IWeather>(weatherUrl),
        axios.get<{ list: IForecast[] }>(forecastUrl)
      ]);

      setCurrentData(weatherResponse.data);

      const filteredForecastData = filterForecastData(forecastResponse.data.list);
      setForecastData(filteredForecastData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (search) {
      fetchWeatherData();
    }
  }, [search]);

  const roundUp = (number: number) => parseFloat(number.toFixed(1));

  const toCelsius = (kelvin: number) => kelvin - 273.15;

  const formatDateToDayOfWeek = (timestamp: number) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(timestamp * 1000);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'Clear':
        return '/sun.png';
      case 'Clouds':
        return '/cloud.png';
      case 'Rain':
        return '/rain.png';
      case 'Snow':
        return '/snow.png';
      default:
        return '/cloud.png';
    }
  };

  const filterForecastData = (forecastList: IForecast[]) => {
    const filteredForecastData: IForecast[] = [];
    const datesAdded = new Set<number>();

    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).getDate();
      if (!datesAdded.has(date)) {
        filteredForecastData.push(forecast);
        datesAdded.add(date);
      }
    });

    return filteredForecastData;
  };

  return (
    <div className="container">
      <h1>Welcome to Kaitlyn's Weather App!</h1>
      <div>
        <input
          className="searchTerm" 
          type="text"
          placeholder="Enter Location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="button" onClick={fetchWeatherData}>Search</button>
      </div> 

      {currentData && (
        <div className="current">
          <h1>Current Weather</h1>
          <div className="currentBox">
            <div className="currentBoxImage">
            <img   src={getWeatherIcon(currentData.main)}   alt={currentData.main}  className="mainIcon" />
            </div>
            <p>Temperature: {roundUp(toCelsius(currentData.temp))}°C</p>
            <p>Feels Like: {roundUp(toCelsius(currentData.feels_like))}°C</p>
          </div>
        </div>
      )}

      <h1>5 Day Forecast</h1>

      {forecastData && (
        <div className="forecast">
          {forecastData.map((forecast, index) => (
            <div className="forecastBox" key={index}>
              <img src={getWeatherIcon(forecast.weather[0].main)} alt={forecast.weather[0].main} />
              <h3>{roundUp(toCelsius(forecast.main.temp))}°C</h3>
              <p>{formatDateToDayOfWeek(forecast.dt)}</p>
              <p>{forecast.weather[0].main}</p>
              <p>Wind: {forecast.wind.speed} m/s</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
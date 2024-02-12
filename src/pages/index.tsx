import { useState, useEffect } from "react";
import axios from "axios";
import Views from "@/components/Views";
import Forecast from '@/components/Forecast';

export default function Home() {
  const apiKey = "99873c3b1d75c5ae62ea9b0aac9dee01";
  const [city, setCity] = useState("Vancouver");
  const [newCity, setNewCity] = useState("");
  const [data, setData] = useState<IWeather[]>([]);

  const fetchData = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const response = await axios.get(url);
      setData(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(city);
  }, [city]);

  const handleSearch = () => {
    setCity(newCity);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>   
      <div>
        <input 
          type="text" 
          placeholder="Enter city..." 
          value={newCity} 
          onChange={(e) => setNewCity(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {data.map((d, index) => (
        <div key={index}>
          {city}
          <Views temp={d.main.temp} feels_like={d.main.feels_like} main={d.weather[0].main} />
        </div>
      ))}
    </main>
  );
}
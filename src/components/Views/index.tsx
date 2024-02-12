import Image from "next/image";

const weather = {
  Clouds: "/cloud.png",
  Clear: "/sun.png",
  Rain: "/rain.png", 
  Snow: "/snow.png"
};

export default function Views({ main, temp, feels_like }) {
  return (
    <div>
      {weather.hasOwnProperty(main) && (
        <Image src={weather[main]} alt={main} width={100} height={100} />
      )}
      <p>{main}</p>
      <p>Temperature: {temp}°C</p>
      <p>Feels Like: {feels_like}°C</p>
    </div>
  );
}
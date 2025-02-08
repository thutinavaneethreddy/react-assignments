import { useEffect, useState } from "react"; 
import axios from 'axios';


const Weather = ({countryName}) => {
  const api_key = import.meta.env.WEATHER_API_KEY // API key for https://www.weatherbit.io/
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    axios.get(`http://api.weatherbit.io/v2.0/current?city=${countryName}&key=${api_key}`).then((response) => {
      console.log(response);
      setWeather({
        temp: response.data.data[0].temp,
        wind: response.data.data[0].wind_spd,
        weatherIcon: response.data.data[0].weather.icon
      })
    })
  }, []);

  if(weather) {
    const weatherIconUrl = `https://cdn.weatherbit.io/static/img/icons/${weather.weatherIcon}.png`
    return (
      <div>
        <div>Temperature - {weather.temp} Celsius</div>
        <img src={weatherIconUrl}/>
        <div>Wind speed - {weather.wind} m/s</div>
      </div> 
    )
  }
  return null
}

const Country = ({country}) => {

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>
        Capital : {country.capital[0]}
      </div>
      <div>
        Area: {country.area}
      </div>
      <div>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map((language) => <li key={language}>{language}</li>)}
        </ul>
      </div>
      <img src={country.flags.png}/>

      <h2>Weather in {country.capital[0]}</h2>
      <Weather countryName={country.capital[0]}/>
    </div>
   
  )
}

const Countries = ({countries, showCountry}) => {
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  else if (countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => 
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => showCountry(country.name.common)}>Show</button>
          </li>)}
      </ul>
      )
  }
  else if (countries.length == 1) {
    return (
      <Country country={countries[0]}/>
    )
  }
};


const App = () => {
  
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      console.log(response.data);
      setCountries(response.data);
    })
  }, []);

 
  const countriesToShow = countries.filter((country) => country.name.common.toLowerCase().includes(query.toLowerCase()));
  console.log(countriesToShow);

  const handleInputChange = (event) => {
    console.log(event.target.value);
    setQuery(event.target.value);
  }

  const showCountry = (countryName) => {
    setQuery(countryName);
  }

  return (
    <>
      <div>Find countries</div>
      <input onChange={handleInputChange}/>
      <Countries countries={countriesToShow} showCountry={showCountry}/>
      
    </>
  )
}

export default App;
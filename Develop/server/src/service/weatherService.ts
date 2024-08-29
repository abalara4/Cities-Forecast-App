import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  constructor(city: string, date: string, description: string, temp: number, humidity: number, wind: number, uvIndex: number, sunrise: string, sunset: string) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.uvIndex = uvIndex;
    this.sunrise = sunrise;
    this.sunset = sunset;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = '';
  private apiKey: string = ''
  private cityName: string = '';
  constructor() {
    this.baseURL = process.env.BASEURL || '';
    this.apiKey = process.env.API_KEY as string;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { city } = response;
    const { dt, weather, main, wind, sys } = response;
    const { description } = weather[0];
    const { temp, humidity } = main;
    const { speed } = wind;
    const { sunrise, sunset } = sys;
    return new Weather(city, dt, description, temp, humidity, speed, 0, sunrise, sunset);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[], sunrise: string, sunset: string) {
    const forecastArray: Weather[] = [];
    forecastArray.push(currentWeather);
    for (let i = 1; i < weatherData.length; i++) {
      const { dt, weather, temp, humidity, wind_speed, uvi } = weatherData[i];
      const { description } = weather[0];
      forecastArray.push(new Weather(this.cityName, dt, description, temp.day, humidity, wind_speed, uvi, sunrise, sunset));
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily, currentWeather.sunrise, currentWeather.sunset);
    return forecastArray
  }
}

export default new WeatherService();

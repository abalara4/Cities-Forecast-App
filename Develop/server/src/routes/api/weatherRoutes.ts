import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  let city = req.body.city;
  res.json(city);
  let weather = WeatherService.getWeatherForCity(city);
  res.json(weather);
  HistoryService.addCity(city);
  
  // TODO: GET weather data from city name
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/api/weather/history', async (_req, res) => {
  let cities = await HistoryService.getCities();
  res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  let id = req.params.id;
  let result = await HistoryService.removeCity(id);
  res.json(result);
});

export default router;

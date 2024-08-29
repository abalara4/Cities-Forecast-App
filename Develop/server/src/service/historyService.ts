import fs from 'fs';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
};

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    return new Promise((resolve, reject) => {
      fs.readFile('searchHistory.json', 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data) as City[]);
        }
      });
    });
  }
  
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return new Promise((resolve, reject) => {
      fs.writeFile('searchHistory.json', JSON.stringify(cities), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('Success');
        }
      });
    });
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities: City[] = await this.read();
    const newCity = new City(city, cities.length.toString());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const index = cities.findIndex((city) => city.id === id);
    if (index === -1) {
      return 'City not found';
    }
    cities.splice(index, 1);
    await this.write(cities);
    return 'City removed';
  }
}

export default new HistoryService();

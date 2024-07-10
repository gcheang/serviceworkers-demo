import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { heroId: 0, heroName: 'Zero' },
      { heroId: 11, heroName: 'Mr. Nice' },
      { heroId: 12, heroName: 'Narco' },
      { heroId: 13, heroName: 'Bombasto' },
      { heroId: 14, heroName: 'Celeritas' },
      { heroId: 15, heroName: 'Magneta' },
      { heroId: 16, heroName: 'RubberMan' },
      { heroId: 17, heroName: 'Dynama' },
      { heroId: 18, heroName: 'Dr IQ' },
      { heroId: 19, heroName: 'Magma' },
      { heroId: 20, heroName: 'Tornado' },
    ];
    return { ping: true, data: heroes };
  }
}

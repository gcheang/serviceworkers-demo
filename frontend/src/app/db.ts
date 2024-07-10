// db.ts
import Dexie, { Table } from 'dexie';

export interface CacheMetadata {
  id?: number;
  cacheDate: Date;
}
export interface CacheHero {
  cacheId: number;
  id?: number;
  heroId: number;
  heroName: string;
}

export class AppDB extends Dexie {
  cacheHeroesTbl!: Table<CacheHero, number>;
  cacheMetadataTbl!: Table<CacheMetadata, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      cacheMetadataTbl: '++id, cacheDate',
      cacheHeroesTbl: '++id, cacheId',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {}
}

export const db = new AppDB();

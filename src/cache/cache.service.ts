import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Flight } from 'src/flights/entities/flight.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheOwnService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  public async getOrFetch<T>(
    cacheKey: string,
    fetchFunction: () => Promise<T>,
    ttl: number = 36000,
  ) {
    const cachedValue = await this.cacheService.get(cacheKey);
    if (cachedValue) {
      return { origin: 'cache', data: cachedValue };
    }
    const fetchedValue = await fetchFunction();
    await this.cacheService.set(cacheKey, fetchedValue, ttl);
    return { origin: 'request', data: fetchedValue };
  }

  public async doesCacheExist(key: string) {
    const cachedData = await this.cacheService.get(key);
    if (cachedData) return true;
    return false;
  }

  public async returnCacheKey(key: string) {
    const cachedData = await this.cacheService.get(key);
    if (cachedData) return cachedData;
    return null;
  }

  public async addCacheDataToKey(key: string, value: any) {
    return await this.cacheService.set(key, value, 50000);
  }

  public async resetCache() {
    return await this.cacheService.reset();
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheOwnService } from './cache.service';
// import { Cache } from 'cache-manager';

describe('CacheOwnService', () => {
  let cacheOwnService: CacheOwnService;

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheOwnService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    cacheOwnService = module.get<CacheOwnService>(CacheOwnService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('getOrFetch', () => {
    it('should return cached value when it exists', async () => {
      const cacheKey = 'testKey';
      const mockValue = { data: 'cachedData' };
      mockCacheService.get.mockResolvedValue(mockValue);

      const result = await cacheOwnService.getOrFetch(cacheKey, jest.fn());
      expect(result).toEqual({ origin: 'cache', data: mockValue });
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(mockCacheService.set).not.toHaveBeenCalled(); // No set call if cache hit
    });

    it('should fetch and cache value when it does not exist', async () => {
      const cacheKey = 'testKey';
      const mockValue = { data: 'fetchedData' };
      mockCacheService.get.mockResolvedValue(null); // Simulate cache miss
      const fetchFunction = jest.fn().mockResolvedValue(mockValue);

      const result = await cacheOwnService.getOrFetch(cacheKey, fetchFunction);
      expect(result).toEqual({ origin: 'request', data: mockValue });
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        cacheKey,
        mockValue,
        36000,
      );
      expect(fetchFunction).toHaveBeenCalled(); // Ensure fetchFunction was called
    });
  });

  describe('doesCacheExist', () => {
    it('should return true if cache exists', async () => {
      const cacheKey = 'testKey';
      mockCacheService.get.mockResolvedValue('cachedValue');

      const result = await cacheOwnService.doesCacheExist(cacheKey);
      expect(result).toBe(true);
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
    });

    it('should return false if cache does not exist', async () => {
      const cacheKey = 'testKey';
      mockCacheService.get.mockResolvedValue(null);

      const result = await cacheOwnService.doesCacheExist(cacheKey);
      expect(result).toBe(false);
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
    });
  });

  describe('returnCacheKey', () => {
    it('should return cached data if it exists', async () => {
      const cacheKey = 'testKey';
      const mockData = { data: 'cachedValue' };
      mockCacheService.get.mockResolvedValue(mockData);

      const result = await cacheOwnService.returnCacheKey(cacheKey);
      expect(result).toBe(mockData);
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
    });

    it('should return null if no cached data exists', async () => {
      const cacheKey = 'testKey';
      mockCacheService.get.mockResolvedValue(null);

      const result = await cacheOwnService.returnCacheKey(cacheKey);
      expect(result).toBeNull();
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
    });
  });

  describe('addCacheDataToKey', () => {
    it('should add data to cache', async () => {
      const cacheKey = 'testKey';
      const value = { data: 'newValue' };

      await cacheOwnService.addCacheDataToKey(cacheKey, value);
      expect(mockCacheService.set).toHaveBeenCalledWith(cacheKey, value, 50000);
    });
  });

  describe('resetCache', () => {
    it('should reset the cache', async () => {
      await cacheOwnService.resetCache();
      expect(mockCacheService.reset).toHaveBeenCalled();
    });
  });
});

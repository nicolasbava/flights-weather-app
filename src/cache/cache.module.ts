import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheOwnService } from './cache.service'; // Adjust the import path as needed

@Module({
  imports: [NestCacheModule.register()], // Register the NestJS cache manager
  providers: [CacheOwnService],
  exports: [CacheOwnService], // Export CacheOwnService so it can be used in other modules
})
export class CacheOwnModule {}

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'

import { CacheService } from './cache.service'

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            url: configService.get<string>('REDIS_URL'),
            namespace: configService.get<string>('REDIS_NAMESPACE'),
          },
          commonOptions: {
            failoverDetector: true,
            keepAlive: 10000,
          },
          readyLog: true,
        }
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule { }

import { ConfigService } from '@nestjs/config'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'

@Injectable()
export class CacheService implements OnModuleInit {
  private readonly logger = new Logger(CacheService.name)
  private readonly redis: Redis
  private readonly nodeEnv: string

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.nodeEnv = this.configService.get<string>('NODE_ENV')
    this.redis = this.redisService.getOrNil(
      this.configService.get<string>('REDIS_NAMESPACE'),
    )
  }

  async onModuleInit() {
    setInterval(
      () => {
        this.redis.ping((err, res) => {
          if (err) {
            this.logger.error('Redis Ping Error:', err)
          }
        })
      },
      1000 * 60 * 5,
    )
  }

  async get<T>(key: string) {
    try {
      if (this.nodeEnv !== 'deploy') {
        this.logger.verbose(`>>> GETTING FROM CACHE: ${key}`)
      }

      const value = await this.redis.get(key)

      const parsedValue: T = JSON.parse(value)

      return parsedValue
    } catch (error) {
      this.logger.error(`Error accessing cache with key ${key}`, error.stack)
      return null
    }
  }

  async set(key: string, value: unknown, ttl: number) {
    if (this.nodeEnv !== 'deploy') {
      this.logger.verbose(`CACHING: ${key}`)
    }

    try {
      const parseValue = JSON.stringify(value)

      await this.redis.set(key, parseValue, 'EX', ttl)
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}`, error.stack)
    }
  }

  async del(key: string) {
    try {
      await this.redis.del(key)
    } catch (error) {
      this.logger.error(`Error deleting cache with key ${key}`, error.stack)
    }
  }

  async delMany(keys: string[]) {
    try {
      await this.redis.del(keys)
    } catch (error) {
      this.logger.error(`Error deleting cache from keys ${keys}`, error.stack)
    }
  }
}

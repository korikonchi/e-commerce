import { createClient, RedisClientType } from 'redis'

class RedisCache {
  public client: RedisClientType
  private static instance: RedisCache

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
      // ...{ password: process.env.REDIS_SECRET }
    })

    this.client.on('error', (err) => console.log('Redis Client Error', err))
    this.client.connect()
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache()
    }
    return RedisCache.instance
  }
}

export default RedisCache

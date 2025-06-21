const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('Redis max reconnection attempts reached');
              return new Error('Redis max reconnection attempts reached');
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('🚀 Redis client ready');
      });

      this.client.on('end', () => {
        console.log('🔌 Redis connection ended');
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  getClient() {
    return this.client;
  }

  isReady() {
    return this.isConnected && this.client;
  }
}

// Create singleton instance
const redisClient = new RedisClient();

module.exports = redisClient; 
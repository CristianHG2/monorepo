/**
 * Redis-powered state management for Twilio Router
 */
import {createClient, RedisClientType} from 'redis';

const state = new (class State {
  client: RedisClientType;

  constructor() {
    this.client = createClient();
  }

  async getJson<P>(key: string): Promise<P | null> {
    await this.ensureConnected();

    const response = await this.client.get(key);
    return response ? JSON.parse(response) : null;
  }

  async setJson<P>(key: string, value: P) {
    await this.ensureConnected();
    await this.client.set(key, JSON.stringify(value));
  }

  async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }
})();

export type RouterAppState = typeof state;

export default state;

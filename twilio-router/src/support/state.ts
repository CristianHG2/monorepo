/**
 * Redis-powered state management for Twilio Router
 */
import {createClient, RedisClientType} from 'redis';
import {Caller, CallerData, MessagePayload} from '../types';
import {CallerObject} from './caller';

export const state = new (class State {
  client: RedisClientType;

  constructor() {
    this.client = createClient();
  }

  async caller(payload: MessagePayload): Promise<Caller> {
    const data = await this.getJson<CallerData>(payload.CallSid);

    return new CallerObject(data || (await this.createCaller(payload)));
  }

  async createCaller(payload: MessagePayload) {
    const data: CallerData = {
      id: payload.CallSid,
    };

    await this.setJson<CallerData>(payload.CallSid, data);

    return data;
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

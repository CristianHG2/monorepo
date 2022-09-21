/**
 * Redis-powered state management for Twilio Router
 */
import {createClient, RedisClientType} from 'redis';
import {
  Caller,
  CallerData,
  Company,
  Language,
  MessagePayload,
  RecordingType,
} from '../types';
import {recordings} from './constants';

export const state = new (class State {
  client: RedisClientType;

  constructor() {
    this.client = createClient();
  }

  async caller(payload: MessagePayload): Promise<Caller> {
    const data = await this.getJson<CallerData>(payload.CallSid);

    const merge = async (newData: Partial<CallerData>) =>
      await this.setJson<CallerData>(payload.CallSid, {
        ...data,
        ...newData,
        id: payload.CallSid,
      });

    return {
      data: data || (await this.createCaller(payload)),
      setLanguage: (language: Language) => merge({language}),
      setCompany: (company: Company) => merge({company}),
      getRecording: (type: RecordingType) =>
        data?.company && data?.language
          ? recordings[data.company][type][data.language]
          : undefined,
    };
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
    return this.client.set(key, JSON.stringify(value));
  }

  async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }
})();

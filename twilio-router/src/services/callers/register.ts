import state, {RouterAppState} from '../../support/state';
import {MessagePayload} from '../../types';
import {CallerObject} from './caller';
import {Caller, CallerData} from '../../types/callers';

const _k = (id: string) => `twilio:${id}`;

const callerRegisterFactory = (state: RouterAppState) => ({
  async getFromTwilioMessage(payload: MessagePayload): Promise<Caller> {
    const data = await state.getJson<CallerData>(_k(payload.CallSid));
    return data ? new CallerObject(data) : await this.create(payload);
  },

  async create(payload: MessagePayload) {
    const data: CallerData = {
      id: payload.CallSid,
      from: payload.From,
      to: payload.To,
    };

    await state.setJson<CallerData>(_k(payload.CallSid), data);

    return new CallerObject(data);
  },

  async set(sid: string, newData: CallerData) {
    await state.setJson<CallerData>(_k(sid), newData);
  },
});

export const register = callerRegisterFactory(state);

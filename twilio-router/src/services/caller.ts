import {
  Caller,
  CallerData,
  Company,
  E164Number,
  Language,
  MessagePayload,
  RecordingType,
} from '../types';
import {state} from '../support/state';
import log from 'loglevel';
import {getCompanyByDID, getCompanyRecordings} from './companies';

export class CallerObject implements Caller {
  data: CallerData;

  constructor(data: CallerData) {
    this.data = data;
  }

  async merge(newData: Partial<CallerData>) {
    await state.setJson<CallerData>(this.data.id, {
      ...this.data,
      ...newData,
    });
  }

  async setLanguage(language: Language) {
    await this.merge({language});
    this.data.language = language;

    log.debug(`Caller ${this.data.id} set language to ${language}`);
  }

  async setCompany(company: Company) {
    await this.merge({company});
    this.data.company = company;

    log.debug(`Caller ${this.data.id} set company to ${company}`);
  }

  errorRecording(): string {
    return this.data.language === 'Spanish'
      ? 'Invalid Option'
      : 'Opcion Invalida';
  }

  safeGetLanguage() {
    const data = this.data;
    if (!data || !data.language) {
      throw new Error('Language not set');
    }

    return data.language;
  }

  getRecording(type: RecordingType) {
    const data = this.data;

    if (!data || !data.company) {
      throw new Error('Caller has no company');
    }

    const recordings = getCompanyRecordings(data.company);

    if (type === 'LanguageSelect') {
      return recordings[type];
    }

    if (!data.language) {
      throw new Error('Language not set');
    }

    return recordings[type][data.language];
  }

  getTwilioLanguage() {
    return this.safeGetLanguage() === 'English' ? 'en-US' : 'es-US';
  }

  hasLanguage(): boolean {
    return !!this.data.language;
  }
}

export const setCompanyForCaller = async (
  caller: Caller,
  message: MessagePayload,
): Promise<Company | undefined> => {
  if (caller.data.company) {
    return caller.data.company;
  }

  if (!message.To.startsWith('+1')) {
    return;
  }

  const company = getCompanyByDID(message.To as E164Number);
  company && (await caller.setCompany(company));

  return company;
};

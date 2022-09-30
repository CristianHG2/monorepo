import {Company, Language, RecordingType} from '../../types';
import log from 'loglevel';
import {getRecording} from '../companies';
import {Caller, CallerData} from '../../types/callers';
import {synchronizeAllMatches} from '../dialpad/contacts';
import {register} from './register';

export class CallerObject implements Caller {
  data: CallerData;

  constructor(data: CallerData) {
    this.data = data;
  }

  hasLanguage(): boolean {
    return !!this.data.language;
  }

  hasCompany(): boolean {
    return !!this.data.company;
  }

  safeGetLanguage() {
    const data = this.data;
    if (!data || !data.language) {
      throw new Error('Language not set');
    }

    return data.language;
  }

  getTwilioLanguage() {
    return this.safeGetLanguage() === 'English' ? 'en-US' : 'es-US';
  }

  async setLanguage(language: Language) {
    this.data.language = language;
    await this.merge({language});

    log.debug(`Caller ${this.data.id} set language to ${language}`);
  }

  async setCompany(company: Company) {
    this.data.company = company;
    await this.merge({company});

    log.debug(`Caller ${this.data.id} set company to ${company}`);
  }

  async merge(newData: Partial<CallerData>) {
    await register.set(this.data.id, {...this.data, ...newData});
    await synchronizeAllMatches(this);
  }

  errorRecording(): string {
    return this.data.language === 'Spanish'
      ? 'Invalid Option'
      : 'Opcion Invalida';
  }

  getRecording(type: RecordingType) {
    const {company, language} = this.data;

    if (!company) {
      throw new Error('Company not set');
    }

    return getRecording(company, type, language);
  }
}

import {Caller, CallerData, Company, Language, RecordingType} from '../types';
import {recordings} from './constants';
import {state} from './state';

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
  }

  async setCompany(company: Company) {
    await this.merge({company});
    this.data.company = company;
  }

  getRecording(type: RecordingType) {
    const data = this.data;

    if (!data || !data.company) {
      throw new Error('Caller has no company');
    }

    if (type === 'LanguageSelect') {
      return recordings[data.company][type];
    }

    if (!data.language) {
      throw new Error('Language not set');
    }

    return recordings[data.company][type][data.language];
  }
}

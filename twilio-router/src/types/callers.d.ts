/* Underlying Caller Data - For use in Redis */
import {Company, Language, RecordingType} from './index';

export interface CallerData {
  id: string;
  from: string;
  to: string;
  language?: Language;
  company?: Company;
}

/* Caller Object */
export interface Caller<
  L extends Language = undefined,
  C extends Company = undefined,
> {
  data: CallerData;

  setLanguage(language: Language): Promise<void>;
  setCompany(company: Company): Promise<void>;

  hasLanguage(): boolean;
  hasCompany(): boolean;

  getTwilioLanguage(): 'en-US' | 'es-US';

  /*
   * Get the string value of a requested recording. Should be
   * returned based on the caller's language and company
   */
  getRecording(type: RecordingType): string;

  errorRecording(): string;
}

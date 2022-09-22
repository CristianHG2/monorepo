import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import handlers from '../handlers';

export type Action = keyof typeof handlers;

export type MessagePayload = {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus:
    | 'queued'
    | 'ringing'
    | 'in-progress'
    | 'completed'
    | 'busy'
    | 'failed'
    | 'no-answer';
  ApiVersion: string;
  Direction: 'inbound' | 'outbound-api' | 'outbound-dial';
  ForwardedFrom?: string;
  CallerName?: string;
  ParentCallSid?: string;
  CallToken?: string;
  'X-Home-Region'?: string;
  FromCity?: string;
  FromState?: string;
  FromZip?: string;
  FromCountry?: string;
  ToCity?: string;
  ToState?: string;
  ToZip?: string;
  ToCountry?: string;
};

export type CallFlowHandler<
  R extends MessagePayload = MessagePayload,
  T extends ScopedTwiml = ScopedTwiml,
> = (caller: Caller, request: R, response: T) => Promise<T> | T;

/* Language and Companies considered in script */
export type Language = 'English' | 'Spanish';
export type Company = 'OCMI' | 'PEO' | 'COMPEO' | 'COGUARD';

/* Different types of recordings that are available */
export type RecordingType =
  | 'LanguageSelect'
  | 'Greeting'
  | 'Hold'
  | 'AfterHours'
  | 'Voicemail'
  | 'Holiday';

export type CompanyRecordings = {
  [key in RecordingType]: key extends 'LanguageSelect'
    ? string
    : {
        [key in Language]: string;
      };
};

export type E164Number = `+1${number}`;

/* Underlying Caller Data - For use in Redis */
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

  /*
   * Get the string value of a requested recording. Should be
   * returned based on the caller's language and company
   */
  getRecording(type: RecordingType): string;

  hasLanguage(): boolean;

  getTwilioLanguage(): 'en-US' | 'es-US';

  errorRecording(): string;
}

export type ScopedTwiml = {
  invalid: () => void;
  gather: (options: {handler: Action; recording: RecordingType}) => void;
  twiml: VoiceResponse;
};

import {ServerlessFunctionSignature} from '@twilio-labs/serverless-runtime-types/types';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

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

export type TwilioHandler = ServerlessFunctionSignature<{}, MessagePayload>;

export type CallFlowHandler<
  R extends MessagePayload = MessagePayload,
  T extends VoiceResponse = VoiceResponse,
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

/* Map of recordings for all companies and languages */
export type Recordings = {
  [key in Company]: {
    [key in RecordingType]: key extends 'LanguageSelect'
      ? string
      : {
          [key in Language]: string;
        };
  };
};

export type E164Number = `+1${number}`;

export type CompanyNumbers = {
  [key in Company]: E164Number[];
};

/* Underlying Caller Data - For use in Redis */
export interface CallerData {
  id: string;
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
}

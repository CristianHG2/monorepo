import VoiceResponse, {Dial} from 'twilio/lib/twiml/VoiceResponse';
import handlers from '../handlers';

export type Action = keyof typeof handlers;

export type MessagePayload = {
  CallSid: string;
  AccountSid: string;
  From: E164Number;
  To: E164Number;
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

export type ScopedTwiml = {
  invalid: () => void;
  gather: (options: {handler: Action; recording: RecordingType}) => void;
  twiml: VoiceResponse;
};

export type DialpadContact = {
  id: DialpadId;
  first_name: string;
  last_name: string;
  phones: string[];
};

export type DialpadContactUpdate = {
  first_name?: string;
  last_name?: string;
  phones?: string[];
};

export type DialpadContactCreate = Omit<DialpadContact, 'id' | 'phones'> & {
  phones?: string[];
};

export type DialpadId = number | string;

import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import {Caller, ScopedTwiml} from '../types';
import {uri} from './utils';

export const scopedTwiml = (caller: Caller): ScopedTwiml => {
  const twiml = new VoiceResponse();

  const sayAttrs = () =>
    caller.hasLanguage() ? {language: caller.getTwilioLanguage()} : {};

  return {
    invalid: () => {
      twiml.say(sayAttrs(), caller.errorRecording());
    },

    gather: ({handler, recording}) => {
      twiml
        .gather({
          action: uri(handler),
          input: ['dtmf'],
          numDigits: 1,
        })
        .say(sayAttrs(), caller.getRecording(recording));
    },

    twiml,
  };
};

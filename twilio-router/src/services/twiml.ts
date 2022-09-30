import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import {ScopedTwiml} from '../types';
import {uri} from '../support/utils';
import {Caller} from '../types/callers';

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

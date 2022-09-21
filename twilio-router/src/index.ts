import {IncomingCallHandler} from './types';
import Twilio from 'twilio';
import {state} from './support/state';
import {baseUrl} from './server';

export const handler: IncomingCallHandler = async (
  context,
  event,
  callback,
) => {
  const caller = await state.caller(event);

  const twiml = new Twilio.twiml.VoiceResponse();

  twiml.gather({
    action: `${baseUrl}`,
    input: ['dtmf'],
    numDigits: 1,
  });

  return callback(null, twiml);
};

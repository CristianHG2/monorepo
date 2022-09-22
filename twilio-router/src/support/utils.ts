import Twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import handlers from '../handlers';

export const baseUrl = 'https://twilio-router-test.ngrok.io';

export const uri = (path: keyof typeof handlers) => `${baseUrl}/${path}`;

export const systemMessages = {
  badMessage: (): VoiceResponse => {
    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.say('Something went wrong. Please try again later.');
    return twiml;
  },
};

export const optionRange = <T extends {Digits: string}>(
  request: T,
  max: number,
  min = 0,
): boolean => {
  const digits = parseInt(request.Digits);
  return digits >= min && digits <= max;
};

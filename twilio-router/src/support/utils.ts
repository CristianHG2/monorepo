import Twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import handlers from '../handlers';
import {Company, Language} from '../types';
import companies from '../services/companies';

export const baseUrl = 'https://twilio-router-test.ngrok.io';

export const testTargetNumber = '+13053913683';

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

export const companyNames = Object.keys(companies) as Company[];
export const languageNames = ['English', 'Spanish'] as Language[];

export const getSystemTags = () => {
  const tagFactory = <T extends string>(sources: T[]) =>
    sources.map(s => s.substring(0, 3).toUpperCase());

  return {
    companies: tagFactory(companyNames),
    languages: tagFactory(languageNames),
  };
};

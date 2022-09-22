import Twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import {Caller, Company, E164Number, MessagePayload} from '../types';
import handlers from '../handlers';
import companies from './companies';

export const baseUrl = 'https://twilio-router-test.ngrok.io';

export const uri = (path: keyof typeof handlers) => `${baseUrl}/${path}`;

export const messages = {
  badMessage: (): VoiceResponse => {
    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.say('Something went wrong. Please try again later.');
    return twiml;
  },
};

export const setCompanyForCaller = async (
  caller: Caller,
  message: MessagePayload,
): Promise<Company | undefined> => {
  if (caller.data.company) {
    return caller.data.company;
  }

  if (!message.To.startsWith('+1')) {
    return;
  }

  const company = companies.getByDID(message.To as E164Number);
  company && (await caller.setCompany(company));

  return company;
};

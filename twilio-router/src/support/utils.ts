import Twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import handlers from '../handlers/index';
import {getCompanyByDID} from '../services/companies';
import {Caller} from '../types/callers';
import {Action} from '../types';
import {Request} from 'express';
import {register} from '../services/callers/register';

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

export const initializeRequest = (req: Request) =>
  new Promise<{caller: Caller; action: Action} | Error>(
    async (resolve, reject) => {
      const body = req.body;
      const caller = await register.getFromTwilioMessage(body);
      const action = req.params.action;

      if (!Object.keys(handlers).includes(action)) {
        reject(new Error(`Invalid action: ${action}`));
      }

      if (!caller.hasCompany()) {
        const company = getCompanyByDID(body.To);

        if (!company) {
          return reject(new Error('Invalid company'));
        }

        await caller.setCompany(company);
      }

      resolve({
        caller,
        action: action as Action,
      });
    },
  );

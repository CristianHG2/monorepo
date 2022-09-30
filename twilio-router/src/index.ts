import express from 'express';
import {systemMessages} from './support/utils';
import handlers from './handlers';
import log from 'loglevel';
import setUpLogger from './support/logger';
import {scopedTwiml} from './services/twiml';
import dotenv from 'dotenv';
import {contactCache} from './services/dialpad/contact-cache';
import {register} from './services/callers/register';
import {getCompanyByDID} from './services/companies';
import {MessagePayload} from './types';

setUpLogger('debug');

dotenv.config({
  path: '.env',
});

const app = express();
const port = 3020;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/:action', async (req, res) => {
  try {
    log.info(`Handling ${req.params.action} request`);

    const body = req.body;
    const caller = await register.getFromTwilioMessage(body);
    const company = getCompanyByDID(body.To);

    if (
      company &&
      !caller.hasCompany() &&
      Object.keys(handlers).includes(req.params.action)
    ) {
      await caller.setCompany(company);
    }

    if (!company && !caller.hasCompany()) {
      log.error(`Invalid request or company: ${req.params.action} ${company}`);
      return res.send(systemMessages.badMessage());
    }

    const action = req.params.action as keyof typeof handlers;
    const xml = (await handlers[action](caller, body, scopedTwiml(caller)))
      .twiml;

    log.debug(`Sending response: ${xml.toString()}`);

    res.send(xml.toString());
  } catch (e) {
    log.error('Error handling request', e);
    res.send(systemMessages.badMessage().toString());
  }
});

app.listen(port, () => {
  log.info(`Twilio Router listening on port ${port}`);
});

/* Indexing Dialpad contacts */
contactCache.build().then(() => log.info('Dialpad contact index built'));

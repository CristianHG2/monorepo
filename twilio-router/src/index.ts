import express from 'express';
import {systemMessages} from './support/utils';
import Twilio from 'twilio';
import handlers from './handlers';
import log from 'loglevel';
import setUpLogger from './support/logger';
import {state} from './support/state';
import {setCompanyForCaller} from './services/caller';
import {scopedTwiml} from './support/snippets';

setUpLogger('debug');

const app = express();
const port = 3020;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/:action', async (req, res) => {
  log.info(`Handling ${req.params.action} request`);

  const body = req.body;
  const caller = await state.caller(body);
  const company = await setCompanyForCaller(caller, body);

  if (!company || !Object.keys(handlers).includes(req.params.action)) {
    log.error(
      `Invalid request or unable to find company for caller: ${req.params.action} ${company}`,
    );

    return res.send(systemMessages.badMessage());
  }

  const action = req.params.action as keyof typeof handlers;
  const xml = (await handlers[action](caller, body, scopedTwiml(caller))).twiml;

  log.debug(`Sending response: ${xml.toString()}`);

  res.send(xml.toString());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

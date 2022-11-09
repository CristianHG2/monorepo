import express from 'express';
import {initializeRequest, systemMessages} from './support/utils';
import handlers from './handlers/index';
import log from 'loglevel';
import setUpLogger from './support/logger';
import {scopedTwiml} from './services/twiml';
import dotenv from 'dotenv';
import {executeRpc} from './support/rpc';

setUpLogger('debug');

dotenv.config({
  path: '.env',
});

const app = express();
const port = 3020;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');
  next();
});

app.options('*', (req, res) => {
  res.status(204).send('');
});

app.post('/_rpc', async (req, res) => {
  log.info('Received RPC request to handler', req.body);

  const body = req.body as {
    module: string;
    handler: string;
    data: any;
  };

  const response = await executeRpc(body.module, body.handler, body.data);

  res.end(
    JSON.stringify({
      data: response,
    }),
  );
});

app.post('/:action', async (req, res) => {
  try {
    log.info(`Handling ${req.params.action} request`);
    const body = req.body;
    const request = await initializeRequest(req);

    if (request instanceof Error) {
      log.error(request);
      return res.send(systemMessages.badMessage());
    }

    const {caller, action} = request;
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
// contactCache.build().then(() => log.info('Dialpad contact index built'));
log.info('Contact cache disabled');

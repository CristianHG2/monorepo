import express from 'express';
import ngrok from 'ngrok';
import portfinder from 'portfinder';
import * as net from 'net';
import options from './options';
import axios from 'axios';
import log from 'loglevel';

type Options = {
  ngrok: {
    authToken: string;
  }
};

export const getAuthTunnel = async () => {
  log.debug('Initializing authentication tunnel');

  const app = express();
  const port = await portfinder.getPortPromise();

  const server = await new Promise<net.Server>(resolve => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });

  log.debug('Express server listening in port', port);

  const url = await ngrok.connect({
    addr: port,
    authtoken: options.ngrokAuthToken,
  });

  log.debug('Ngrok tunnel URL:', url);

  return {
    express: app,
    url,
    waitForCode: (): Promise<string> => {
      return new Promise(resolve => {
        app.get('/', (req, res) => {
          resolve(req.query.code as string);
          res.send('<h1>You can go back to your terminal now</h1>');
        });
      });
    },
    disconnect: async () => {
      log.debug('Disconnecting tunnel and web server');

      await ngrok.disconnect(url);
      await new Promise(resolve => server.close(resolve));
    }
  };
};

export const exchangeCodeForToken = async (code: string, redirect_uri: string) => {
  log.info('Exchanging code', code, 'for token');

  const {data} = await axios.postForm('https://stackoverflow.com/oauth/access_token', {
    client_id: options.clientId,
    client_secret: options.clientSecret,
    code,
    redirect_uri
  });

  log.info('SO API responded with', data);

  return (new URLSearchParams(data)).get('access_token');
};

export const getAccessToken = async (): Promise<string> => {
  if (process.env.STACKEX_ACCESS_TOKEN) {
    return process.env.STACKEX_ACCESS_TOKEN;
  }

  const authUri = await getAuthTunnel();

  const uri = `https://stackoverflow.com/oauth?${(new URLSearchParams({
    client_id: options.clientId,
    scope: 'no_expiry,access_team|stackoverflow.com/c/lifespikes',
    redirect_uri: authUri.url,
  }))}`;

  log.info(`Please visit ${uri} and authorize this app. Waiting for code...`);

  const token = await exchangeCodeForToken(await authUri.waitForCode(), authUri.url);
  log.info('Save your STACKEX_ACCESS_TOKEN in your .env file to avoid this step next time:', token);

  await authUri.disconnect();

  return token ?? throwError();
};

const throwError = () => {
  throw new Error('Failed to get access token');
};

import express from 'express';
import ngrok from 'ngrok';
import portfinder from 'portfinder';
import * as net from 'net';
import log from 'loglevel';
import axios, {AxiosError} from 'axios';
import {createHash} from 'crypto';
import {makeAuthUri, OAuthOptions} from '../support/oauth';
import state from '../support/state';

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
    authtoken: process.env.NGROK_AUTH_TOKEN,
  });

  log.debug('Ngrok tunnel URL:', url);

  return {
    express: app,
    url,
    waitForCode: (): Promise<Record<string, any>> => {
      return new Promise(resolve => {
        app.get('/', (req, res) => {
          resolve(req.query);
          res.send('<h1>You can go back to your terminal now</h1>');
        });
      });
    },
    disconnect: async () => {
      log.debug('Disconnecting tunnel and web server');

      await ngrok.disconnect(url);
      await new Promise(resolve => server.close(resolve));
    },
  };
};

interface Base {
  authUri: string;
  exchangeUri: string;
  forceAuth: boolean;
}

interface WithOptions extends Base {
  generators?: never;
  options: OAuthOptions;
}

interface WithGenerators extends Base {
  generators: {
    authorization: () => OAuthOptions;
    exchange?: (response: Record<string, any>) => Record<string, any>;
  };
  options?: never;
}

type TunnelOptions = WithOptions | WithGenerators;

export const performAuthCodeFlow = async ({
  authUri,
  exchangeUri,
  options,
  generators,
  forceAuth = false,
}: TunnelOptions) => {
  const query = (generators?.authorization() ?? options) as OAuthOptions;
  const hash = createHash('md5')
    .update(makeAuthUri(authUri, query))
    .digest('base64')
    .toString();

  if (state.cacheHas(hash) && !forceAuth) {
    return state.state.cache[hash];
  }

  const tunnel = await getAuthTunnel();
  const authUriWithRedirect = makeAuthUri(authUri, {
    ...query,
    redirectUri: tunnel.url,
  });

  log.info(`
  Tunnel opened: ${tunnel.url}
  IMPORTANT, DO FIRST: Ensure the URL above is added to your Redirect URIs
  Once the above is done, click below to continue
  
  ${authUriWithRedirect}
  
  Waiting to receive authorization code...
  `);

  const response = await tunnel.waitForCode();
  log.debug(
    `Got response: ${JSON.stringify(response)}, performing exchange...`,
  );

  const exchangeBody = generators?.exchange
    ? generators.exchange(response)
    : {
        grant_type: 'authorization_code',
        code: response.code,
        redirect_uri: tunnel.url,
      };

  const credentials = Buffer.from(
    `${query.clientId}:${query.clientSecret}`,
  ).toString('base64');

  try {
    const token = (
      await axios.post(exchangeUri, new URLSearchParams(exchangeBody), {
        headers: {Authorization: `Basic ${credentials}`},
      })
    ).data;

    state.cache(hash, token);
    log.debug(`Stored token in cache with key ${hash}`);

    return token;
  } catch (error) {
    if (error instanceof AxiosError) {
      log.error(error.config, error.response?.status, error.response?.data);
      process.exit(1);
    } else {
      throw error;
    }
  }
};

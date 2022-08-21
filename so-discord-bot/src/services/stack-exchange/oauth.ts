import options from './options';
import axios from 'axios';
import log from 'loglevel';
import {getAuthTunnel} from '../ngrok-oauth';

export const exchangeCodeForToken = async (
  code: string,
  redirect_uri: string,
) => {
  log.info('Exchanging code', code, 'for token');

  const {data} = await axios.postForm(
    'https://stackoverflow.com/oauth/access_token',
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code,
      redirect_uri,
    },
  );

  log.info('SO API responded with', data);

  return new URLSearchParams(data).get('access_token');
};

export const getAccessToken = async (): Promise<string> => {
  if (process.env.STACKEX_ACCESS_TOKEN) {
    return process.env.STACKEX_ACCESS_TOKEN;
  }

  const authUri = await getAuthTunnel();

  const uri = `https://stackoverflow.com/oauth?${new URLSearchParams({
    client_id: options.clientId,
    scope: 'no_expiry,access_team|stackoverflow.com/c/lifespikes',
    redirect_uri: authUri.url,
  })}`;

  log.info(`Please visit ${uri} and authorize this app. Waiting for code...`);

  const token = await exchangeCodeForToken(
    (
      await authUri.waitForCode()
    ).code,
    authUri.url,
  );
  log.info(
    'Save your STACKEX_ACCESS_TOKEN in your .env file to avoid this step next time:',
    token,
  );

  await authUri.disconnect();

  return token ?? throwError();
};

const throwError = () => {
  throw new Error('Failed to get access token');
};

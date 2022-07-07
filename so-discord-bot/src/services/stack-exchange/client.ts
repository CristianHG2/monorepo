import axios from 'axios';
import options from './options';
import log from 'loglevel';
import {getSizeInBytes} from '../../support/debug/sizeof';

export default async () => {
  const c = axios.create({
    baseURL: 'https://api.stackexchange.com/2.3/',
    params: {
      site: 'stackoverflow',
      team: 'stackoverflow.com/c/lifespikes',
      key: options.key,
    },
    headers: {
      'X-API-Access-Token': await options.accessToken(),
    },
  });

  c.interceptors.request.use(config => {
    const params = new URLSearchParams(config.params);
    log.debug(
      config.method,
      `${config.baseURL}${config.url}?${params.toString()}`,
    );
    return config;
  });

  c.interceptors.response.use(response => {
    log.debug(
      response.status,
      response.statusText,
      `${getSizeInBytes(response.data)} Bytes`,
    );
    return response;
  });

  return c;
};

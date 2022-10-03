import makeClient from './client';
import {Wrappers} from '@userscripters/stackexchange-api-types';
import {
  Question,
  Answer,
} from '@userscripters/stackexchange-api-types/lib/types';

type Query<T extends string = string> = {
  [key in T]?: string;
};

export const request = async <T extends object>(
  endpoint: string,
  params?: Query,
): Promise<Wrappers.CommonWrapperObject<T>> => {
  const client = await makeClient();
  return (await client.get(endpoint, {params})).data;
};

import {DialpadContact} from './dialpad';
import {RouterAppState} from '../../support/state';

export type ContactCacheData = {
  [key: string]: DialpadContact[];
};

export interface ContactCache {
  build(): Promise<void>;
  set(phone: string, contact: DialpadContact[]): Promise<void>;
  get(phone: string): Promise<DialpadContact[]>;
  merge(phone: string, contact: DialpadContact): Promise<void>;
  clean(str: string): string;
}

export interface ContactCacheFactory {
  (state: RouterAppState): ContactCache;
}

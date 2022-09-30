import {DialpadId} from './index';

export type DialpadContact = {
  id: DialpadId;
  first_name: string;
  last_name: string;
  phones: string[];
};

export type DialpadContactUpdate = {
  first_name?: string;
  last_name?: string;
  phones?: string[];
};

export type DialpadContactCreate = Omit<DialpadContact, 'id' | 'phones'> & {
  phones?: string[];
};

export type DialpadId = number | string;

import {DialpadId} from './index';

export type DialpadContact = {
  id: DialpadId;
  first_name: string;
  last_name: string;
  phones: string[];
};

export type DialpadId = number | string;

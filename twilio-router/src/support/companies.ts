import {phoneNumbers} from './constants';
import {Company, E164Number} from '../types';

const companies = {
  getByDID: (did: E164Number): Company | undefined => {
    const entry = Object.entries(phoneNumbers).find(([company, numbers]) =>
      numbers.includes(did),
    ) as [Company, E164Number[]] | undefined;

    return entry ? entry[0] : undefined;
  },
};

export default companies;

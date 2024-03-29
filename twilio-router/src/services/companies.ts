import {
  Company,
  CompanyRecordings,
  E164Number,
  Language,
  RecordingType,
} from '../types';
import locales from '../locales/index';

type CompanyRepository = {
  [key in Company]: {
    numbers: E164Number[];
    recordings: CompanyRecordings;
  };
};

export const companies: CompanyRepository = {
  OCMI: {
    numbers: ['+17178627978'],
    recordings: locales.ocmi,
  },
  PEO: {
    numbers: [],
    recordings: locales.peo,
  },
  COMPEO: {
    numbers: [],
    recordings: locales.compeo,
  },
  COGUARD: {
    numbers: [],
    recordings: locales.coguard,
  },
};

export const getCompanyByDID = (did: E164Number): Company | undefined => {
  for (const company in companies) {
    if (companies[company as Company].numbers.includes(did)) {
      return company as Company;
    }
  }
};

export const getCompanyRecordings = (company: Company): CompanyRecordings =>
  companies[company].recordings;

export const getRecording = (
  company: Company,
  type: RecordingType,
  language?: Language,
): string => {
  const recordings = getCompanyRecordings(company);

  if (type === 'LanguageSelect') {
    return recordings[type];
  }

  if (!language) {
    throw new Error('Language not set');
  }

  return recordings[type][language];
};

export default companies;

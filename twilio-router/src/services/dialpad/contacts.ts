import dialpad from './index';
import log from 'loglevel';
import {state} from '../../support/state';
import {
  DialpadContact,
  DialpadContactCreate,
  DialpadContactUpdate,
  DialpadId,
  TagObject,
} from '../../types';
import {getSystemTags} from '../../support/utils';

const indexIsReady = async () => {
  const index = await state.getJson('dialpad:last_updated');
  return index !== null;
};

export const indexSharedContacts = async () => {
  log.info('Indexing shared Dialpad contacts');

  const index: Record<string, any> = {};
  const client = dialpad.client();

  if (await indexIsReady()) {
    log.info('Dialpad contacts have already been indexed');
    return;
  }

  log.info('Getting all Dialpad contacts');
  const contacts = await client.contacts.list();

  log.info(`Result size ${contacts.length}, indexing...`);
  contacts.map(contact => {
    if (!contact?.phones) {
      return;
    }

    for (const phone of contact.phones) {
      index[phone] = {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        phones: contact.phones,
      };
    }
  });

  log.info(
    'Index size of ' + Object.keys(index).length + ', saving to redis...',
  );
  await Promise.all(
    Object.entries(index).map(async ([key, value]) => {
      await state.addContactToIndex(key, value);
    }),
  );

  log.info('Done!');
  await state.setJson('dialpad:last_updated', {
    timestamp: new Date().getTime(),
  });
};

export const updateContact = async (
  id: DialpadId,
  data: DialpadContactUpdate,
) => await dialpad.client().contacts.update(id, data);

export const searchContact = async (phone: string) => {
  const contact = await state.getContactFromIndex(phone);

  return contact
    ? {
        ...contact,
        update: async (data: DialpadContactUpdate) =>
          updateContact(contact.id, data),
      }
    : null;
};

export const createContact = async (data: DialpadContactCreate) => {
  const contact = await dialpad.client().contacts.create(data);

  return {
    ...contact,
    update: async (data: DialpadContactUpdate) =>
      updateContact(contact.id, data),
  };
};

const getCurrentTags = (contact: DialpadContact) => {
  const first_name = contact.first_name ?? '';
  const {companies, languages} = getSystemTags();

  const tagExpressions = [
    `(?<language>\\[(${languages.join('|')})\\])?`,
    `(?<company>\\[(${companies.join('|')})\\])?`,
  ];

  const tagRegex = new RegExp(`${tagExpressions.join()}(?<name>.*)`, 'mg');
  const [matches] = [...first_name.matchAll(tagRegex)];

  return {
    language: '',
    company: '',
    name: first_name,
    ...(matches?.groups ?? {}),
  };
};

export const updateContactTags = async (
  contact: DialpadContact,
  {language, company}: TagObject,
) => {
  const currentTags = getCurrentTags(contact);

  const updatedName = [
    language ? `[${language}]` : currentTags.language,
    company ? `[${company}]` : currentTags.company,
    currentTags.name,
  ].join('');

  await updateContact(contact.id, {
    first_name: updatedName,
  });
};

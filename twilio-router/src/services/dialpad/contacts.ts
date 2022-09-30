import dialpad from './index';
import {
  DialpadContact,
  DialpadContactCreate,
  DialpadContactUpdate,
  DialpadId,
} from '../../types';
import {contactCache} from './contact-cache';
import {Caller} from '../../types/callers';

export const updateContact = async (
  id: DialpadId,
  data: DialpadContactUpdate,
) => await dialpad.client().contacts.update(id, data);

export const createContact = async (data: DialpadContactCreate) => {
  const contact = await dialpad.client().contacts.create(data);
  contact.phones.forEach(phone => contactCache.merge(phone, contact));

  return {
    ...contact,
    update: async (data: DialpadContactUpdate) =>
      updateContact(contact.id, data),
  };
};

const removeTags = (name: string) =>
  name.replaceAll(new RegExp('[[A-Z]*]', 'g'), '');

const tag = (str?: string) =>
  str ? `[${str.substring(0, 3).toUpperCase()}]` : '';

export const synchronizeAllMatches = async (caller: Caller) => {
  const result = await contactCache.get(caller.data.from);

  const contacts = !result.length
    ? [
        await createContact({
          first_name: tag(caller.data.company),
          last_name: caller.data.from,
          phones: [caller.data.from],
        }),
      ]
    : result;

  await Promise.all(
    contacts.map(contact => synchronizeContact(caller, contact)),
  );
};

const synchronizeContact = async (caller: Caller, contact: DialpadContact) => {
  const client = dialpad.client();
  const latest = await client.contacts.get(contact.id);
  const cleanName = removeTags(latest.first_name);

  await client.contacts.update(contact.id, {
    first_name: [
      tag(caller.data.company),
      tag(caller.data.language),
      cleanName,
    ].join(' '),
  });
};

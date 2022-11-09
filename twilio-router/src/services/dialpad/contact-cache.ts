import {
  ContactCacheData,
  ContactCacheFactory,
} from '../../types/dialpad/contact-cache';
import {DialpadContact} from '../../types/dialpad/dialpad';
import log from 'loglevel';
import dialpad from './index';
import state, {RouterAppState} from '../../support/state';

const _k = (id: string) => `dialpad:${id}`;

const commitToRedis = (state: RouterAppState, data: ContactCacheData) =>
  Promise.all(
    Object.entries(data).map(([key, value]) => state.setJson(_k(key), value)),
  );

export const contactCacheFactory: ContactCacheFactory = state => ({
  async build() {
    log.info('Indexing shared Dialpad contacts');
    const client = dialpad.client();
    const contacts = await client.contacts.list();
    const index: ContactCacheData = {};

    for (const contact of contacts) {
      if (!contact.phones) {
        log.debug(`Skipping contact ${contact.id} with no phone numbers`);
        continue;
      }

      contact.phones.forEach(phone => {
        const tenDigit = this.clean(phone);

        if (index[tenDigit]) {
          index[tenDigit].push(contact);
        } else {
          index[tenDigit] = [contact];
        }
      });
    }

    log.info('Saving Dialpad contact index to Redis');
    await commitToRedis(state, index);
  },

  async get(phone: string): Promise<DialpadContact[]> {
    return (await state.getJson(_k(this.clean(phone)))) ?? [];
  },

  async set(phone: string, contact: DialpadContact[]): Promise<void> {
    await state.setJson(_k(this.clean(phone)), contact);
  },

  async merge(phone: string, contact: DialpadContact): Promise<void> {
    const existing = await this.get(phone);

    log.debug(existing, contact);

    await this.set(phone, [
      ...(existing && !Array.isArray(existing) ? [existing] : existing),
      contact,
    ]);
  },

  clean(str: string) {
    return str.slice(-10);
  },
});

export const contactCache = contactCacheFactory(state);

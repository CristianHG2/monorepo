import axios from 'axios';
import {
  DialpadContact,
  DialpadContactCreate,
  DialpadContactUpdate,
  DialpadId,
} from '../../types';

type ContactResponse = {
  cursor: string;
  items: DialpadContact[];
};

export default () => {
  const client = axios.create({
    baseURL: 'https://dialpad.com/api/v2/',
    headers: {
      Authorization: `Bearer ${process.env.DIALPAD_API_KEY}`,
      Accept: 'application/json',
    },
  });

  const contacts = {
    list: async (
      cursor?: string,
      buffer: DialpadContact[] = [],
    ): Promise<DialpadContact[]> => {
      const res = (
        await client.get<ContactResponse>('contacts', {
          params: {
            limit: 128,
            cursor,
          },
        })
      ).data;

      const concat = [...buffer, ...res.items];
      return res.cursor && res.items.length > 0
        ? contacts.list(res.cursor, concat)
        : concat;
    },

    update: async (id: DialpadId, data: DialpadContactUpdate) =>
      await client.patch(`contacts/${id}`, data),

    create: async (data: DialpadContactCreate): Promise<DialpadContact> =>
      await client.post('contacts', data),
  };

  return {
    contacts,
  };
};

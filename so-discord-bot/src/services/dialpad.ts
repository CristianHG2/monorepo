import axios, {AxiosError} from 'axios';
import log from 'loglevel';
import {ray} from 'node-ray';

type Items<T> = {
  items: T[];
};

type Departments = Items<{
  id: number;
  name: string;
  phone_numbers?: string[];
}>;

type Users = Items<{
  id: string;
  first_name: string;
  last_name: string;
  phone_numbers?: string[];
}>;

type Numbers = Items<{
  number: string;
  target_id: string;
  target_type: 'department' | 'user' | 'office' | string;
  status: string;
}>;

const dialpad = axios.create({
  baseURL: 'https://dialpad.com/api/v2/',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.DIALPAD_API_KEY}`,
  },
});

const get = async <T = any>(resource: string, params?: Record<string, any>) =>
  (await dialpad.get(resource, {params})).data as T;

export const getNumbersWithTarget = async () => {
  const numbers = await get<Numbers>('numbers', {limit: 128});

  return await Promise.all(
    numbers.items.map(async number => {
      const nameFactory = {
        department: async () =>
          (await get(`departments/${number.target_id}`)).name,
        user: async () => {
          try {
            const user = await get(`users/${number.target_id}`);
            return `${user.first_name} ${user.last_name}`;
          } catch (e) {
            if (e instanceof AxiosError) {
              if (e.response?.status === 404) {
                return 'Deleted User';
              }
            }
          }
        },
        office: async () => 'OCMI',
        undefined: async () => 'Not In Use',
      }[number.target_type];

      if (!nameFactory) {
        log.error(`Unknown target type: ${number.target_type}`);
        ray(number);
        return;
      }

      return {
        name: await nameFactory(),
        ...number,
      };
    }),
  );
};

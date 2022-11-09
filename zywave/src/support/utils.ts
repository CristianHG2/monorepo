export const utils = {
  create: <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes: Record<string, any> = {},
  ): HTMLElementTagNameMap[K] => {
    const el = document.createElement(tag);

    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }

    return el;
  },

  get: (selector: string) => document.querySelector(selector),
};

export const waitForElement = <E extends HTMLElement = HTMLElement>(
  selector: string,
  timeout = 5000,
): Promise<E> =>
  new Promise((resolve, reject) => {
    const el = utils.get(selector);

    if (el) {
      return resolve(el as E);
    }

    const _check = setInterval(() => {
      const el = utils.get(selector);

      if (el) {
        clearInterval(_check);
        return resolve(el as E);
      }
    });

    setTimeout(() => {
      reject(new Error(`Element not found: ${selector}`));
      clearInterval(_check);
    }, timeout);
  });

export const getExceptionMessage = (e: unknown) => {
  if (typeof e === 'string') {
    return e;
  }

  if (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    typeof (e as {message: unknown}).message === 'string'
  ) {
    return (e as {message: string}).message;
  }

  return 'Unknown error';
};

const getObjectArrayValues = <T extends Record<string, any>[]>(objs: T) => {
  const rows = Object.values(objs).map(obj => Object.values(obj));

  return [Object.keys(objs[0]), ...rows].map(row =>
    row.map(val => (typeof val === 'string' ? `"${val}"` : val) ?? ''),
  );
};

const arrayToCsv = <T extends string[][]>(arr: T) => {
  return arr.map(row => row.join(',')).join(`\n`);
};

const downloadBlob = (
  content: BlobPart,
  filename: string,
  contentType: string,
) => {
  const blob = new Blob([content], {type: contentType});
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  a.click();
};

export const downloadCSV = (
  data: Record<string, any>[],
  filename = 'data.csv',
) => {
  const rows = arrayToCsv(getObjectArrayValues(data));
  downloadBlob(rows, filename, 'text/csv');
};

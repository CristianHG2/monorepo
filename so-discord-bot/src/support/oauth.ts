export type OAuthOptions = {
  clientId: string;
  scope?: string;
  redirectUri?: string;
  state?: string;
  responseType?: string;
} & Record<string, string>;

const objectKeysToSnakeCase = (obj?: Record<string, any>) => {
  if (!obj) return;

  const newObj: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    newObj[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = obj[key];
  }
  return newObj;
};

export const makeAuthUri = (baseUri: string, options: OAuthOptions) => {
  return `${baseUri}?${new URLSearchParams({
    scope: '',
    redirect_uri: '',
    state: 'none',
    response_type: 'code',
    ...objectKeysToSnakeCase(options),
  })}`;
};

import {performAuthCodeFlow} from '../ngrok-oauth';

export const getAccessToken = async () => {
  return await performAuthCodeFlow({
    authUri: 'https://appcenter.intuit.com/connect/oauth2',
    exchangeUri: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    options: {
      clientId: process.env.QUICKBOOKS_CLIENT_ID,
      clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
      scope: 'com.intuit.quickbooks.accounting',
    },
  });
};

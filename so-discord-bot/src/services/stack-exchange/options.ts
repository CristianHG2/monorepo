import {getAccessToken} from './oauth';

class Options {
  public ngrokAuthToken: any;
  public clientSecret: any;
  public clientId: any;
  public key: any;

  constructor() {
    this.key = process.env.STACKEX_KEY;
    this.clientId = process.env.STACKEX_CLIENT_ID;
    this.clientSecret = process.env.STACKEX_CLIENT_SECRET;
    this.ngrokAuthToken = process.env.NGROK_AUTH_TOKEN;
  }

  async accessToken() {
    return await getAccessToken();
  }
}

export default new Options();

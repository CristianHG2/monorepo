export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STACKEX_KEY: string;
      STACKEX_CLIENT_ID: string;
      STACKEX_CLIENT_SECRET: string;
      NGROK_AUTH_TOKEN: string;
      STACKEX_ACCESS_TOKEN?: string | null;
      DISCORD_APP_ID: string;
      DISCORD_PUBLIC_KEY: string;
      DISCORD_BOT_TOKEN: string;
      OPENAI_API_KEY: string;
      QUICKBOOKS_CLIENT_ID: string;
      QUICKBOOKS_CLIENT_SECRET: string;
      QUICKBOOKS_REALM_ID: string;
    }
  }
}

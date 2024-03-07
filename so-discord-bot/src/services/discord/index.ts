import {Client, GatewayIntentBits} from 'discord.js';
import log from 'loglevel';

export const startDiscordBot = async (botToken: string) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on('ready', () => {
    log.info(`Logged in as ${client.user?.tag}`);
  });

  client.on('messageCreate', async message => {
    if (!message.author.bot) {
      //
    }
  });

  await client.login(botToken);

  return client;
};

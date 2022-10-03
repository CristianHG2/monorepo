import {Client, GuildMember, Intents} from 'discord.js';
import log from 'loglevel';

export const startDiscordBot = async (botToken: string) => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
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

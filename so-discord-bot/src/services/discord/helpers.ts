import {Client, GuildTextBasedChannel} from 'discord.js';
import state from '../../support/state';
import log from 'loglevel';

export const getGuild = async (bot: Client) => {
  const guild = await bot.guilds.cache.get(state.guildId);

  if (!guild) {
    log.error(`Could not find guild with id ${state.guildId}`);
    throw new Error('Could not find guild');
  }

  return guild;
};

export const getMembers = async (bot: Client) => {
  const guild = await getGuild(bot);
  return guild.members.list({
    limit: 100,
  });
};

export const insensitiveFindChannel = async (bot: Client, name: string) => {
  const guild = await getGuild(bot);
  return (await guild.channels.cache).find(
    channel => channel.name.toLowerCase().includes(name) && channel.isText(),
  ) as GuildTextBasedChannel;
};

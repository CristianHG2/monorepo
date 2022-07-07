import {
  Client,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from 'discord.js';
import log from 'loglevel';
import state from '../../support/state';
import * as events from 'events';
import {getMembers} from '../../services/discord/helpers';
import {actions} from './constants';

const memberListEmbed = async (bot: Client): Promise<MessageEmbed> => {
  const members = await getMembers(bot);
  const current = state.listParticipants();
  const names = current.map(e => {
    const user = members.find(member => member.id === e.id);
    return `- ${user?.displayName}`;
  });

  return new MessageEmbed({
    title: 'Stand-up Participants',
    description: names.join(`\n`) || 'No participants',
    color: 'DARK_PURPLE',
  });
};

const isOnList = (member: {id: string}) =>
  state.listParticipants().find(e => e.id === member.id);

const toggleMemberEmbed = async (bot: Client): Promise<any> => {
  const members = await getMembers(bot);

  return new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId(actions.TOGGLE_MEMBER)
      .setPlaceholder('Add or remove a standup participant')
      .setOptions(
        members
          .filter(e => !e.user.bot)
          .map(e => ({
            label: e.displayName,
            value: e.id,
          })),
      ),
  );
};

const hooks = new events.EventEmitter();

export default (bot: Client) => {
  bot.on('messageCreate', async interaction => {
    if (interaction.author.bot || !interaction.inGuild()) {
      return;
    }

    if (interaction.content === '!standup-ctl') {
      log.debug('standup-ctl command received, sending initial command');

      const factory = async () => ({
        embeds: [await memberListEmbed(bot)],
        components: [await toggleMemberEmbed(bot)],
      });

      const msg = await interaction.reply(await factory());

      hooks.on(actions.MODIFIED_LIST, async () => {
        log.debug('list modified, updating embed');
        await msg.edit(await factory());
      });
    }
  });

  bot.on('interactionCreate', async interaction => {
    if (
      interaction?.member?.user.bot ||
      !interaction.inGuild() ||
      (!interaction.isButton() && !interaction.isSelectMenu())
    ) {
      return;
    }

    if (
      interaction.customId === actions.TOGGLE_MEMBER &&
      interaction.isSelectMenu()
    ) {
      const value = {id: interaction.values[0]};

      !isOnList(value)
        ? state.addParticipant(value)
        : state.removeParticipant(value);

      hooks.emit(actions.MODIFIED_LIST);

      await interaction.update({content: 'List was modified and updated'});
    }
  });
};

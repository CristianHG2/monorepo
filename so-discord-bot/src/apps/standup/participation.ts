import {Client, Message} from 'discord.js';
import state from '../../support/state';
import {
  getMembers,
  insensitiveFindChannel,
} from '../../services/discord/helpers';
import log from 'loglevel';
import {actions} from './constants';
import {StandupParticipant} from '../../types/state';

let reminderTimer: string | number | NodeJS.Timeout | undefined;

const clearStandup = () => {
  state.stopStandup();
  reminderTimer && clearInterval(reminderTimer);
};

const remindPending = async (bot: Client) => {
  const pending = state.getPendingParticipants();
  const channel = await insensitiveFindChannel(bot, 'general');
  const members = await getMembers(bot);

  if (!channel) {
    log.error('Could not find #general channel');
    return;
  }

  const pendingNames = members
    .filter(e => pending.includes({id: e.user.id}))
    .map(e => e.user.toString());

  channel.send(
    `${pendingNames.join(
      ', ',
    )}, haven't heard from you 🤔, please submit your standup soon!`,
  );
};

const reminderFactory = (bot: Client) => () => remindPending(bot);

export const startStandupMonitor = (
  bot: Client,
  sourceMsg: Message,
  members: StandupParticipant[],
) => {
  state.startStandup(members);

  reminderTimer = setInterval(reminderFactory(bot), 1000 * 60 * 10);
  setTimeout(clearStandup, 1000 * 60 * 60);

  bot.on('interactionCreate', async interaction => {
    if (
      interaction.isButton() &&
      interaction.customId === actions.ACKNOWLEDGE
    ) {
      if (!state.standupActive()) {
        await interaction.reply(`Stand-up is not active.`);
        return;
      }

      const actor = interaction?.member?.user;
      actor && state.markAcknowledged({id: actor.id});

      await interaction.reply({
        content: `Thank you, ${actor?.username}! Response recorded! 🥳️`,
        ephemeral: true,
      });
    }
  });
};

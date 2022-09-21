import {Client, Message} from 'discord.js';
import state from '../../support/state';
import {
  getMembers,
  insensitiveFindChannel,
} from '../../services/discord/helpers';
import log from 'loglevel';
import {actions} from './constants';
import {StandupParticipant} from '../../types/state';

export const clearStandup = () => {
  log.debug('Clearing standup');

  clearTimeout(state.getTimer('standupTimer'));
  clearInterval(state.getTimer('standupReminder'));

  state.stopStandup();
};

export const remindPending = async (bot: Client) => {
  const pending = state.getPendingParticipants();
  const channel = await insensitiveFindChannel(bot, '🤝general');
  const members = await getMembers(bot);

  if (!channel) {
    log.error('Could not find 🤝general channel');
    return;
  }

  log.debug(`State shows ${pending.length} pending participants`);

  const pendingNames = members
    .filter(e => pending.some(p => p.id === e.id))
    .map(e => e.user.toString());

  log.debug(`Retrieved ${pendingNames.length} mentions for reminders`);

  pendingNames.length > 0 &&
    channel.send(
      `${pendingNames.join(
        ', ',
      )}, haven't heard from you 🤔, please submit your standup soon!`,
    );
};

const minutes = (minutes: number) => 1000 * 60 * minutes;

const reminderFactory = (bot: Client) => () => remindPending(bot);

export const startStandupMonitor = (
  bot: Client,
  sourceMsg: Message,
  members: StandupParticipant[],
) => {
  state.startStandup(members);

  const timers = {
    standupReminder: setInterval(reminderFactory(bot), minutes(5)),
    standupTimer: setTimeout(clearStandup, minutes(60)),
  };

  for (let [key, value] of Object.entries(timers)) {
    state.setTimer(key as 'standupReminder' | 'standupTimer', value);
  }

  bot.on('interactionCreate', async interaction => {
    if (
      interaction.isButton() &&
      interaction.customId === actions.ACKNOWLEDGE
    ) {
      if (!state.standupActive()) {
        await interaction.reply(`Stand-up is not active.`);
        return;
      }

      log.debug(`${interaction?.member?.user?.username} reported for standup`);

      const actor = interaction?.member?.user;
      actor && state.markAcknowledged({id: actor.id});

      await interaction.reply({
        content: `Thank you, ${actor?.username}! Response recorded! 🥳️`,
        ephemeral: true,
      });
    }
  });
};

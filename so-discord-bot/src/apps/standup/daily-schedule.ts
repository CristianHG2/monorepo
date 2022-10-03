import {Range} from 'node-schedule';
import {
  Client,
  MessageActionRow,
  MessageButton,
  MessageOptions,
} from 'discord.js';
import log from 'loglevel';
import state from '../../support/state';
import {insensitiveFindChannel} from '../../services/discord/helpers';
import {actions} from './constants';
import {makeEmbed} from './notice-embed';
import {startStandupMonitor} from './participation';
import {jobFrequency} from '../../support/scheduler';

const standupMessage = async (): Promise<MessageOptions> => {
  return {
    content: `@everyone Time for stand-up, please provide responses in #general. 😎`,
    components: [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(actions.ACKNOWLEDGE)
          .setStyle('SUCCESS')
          .setEmoji('✅')
          .setLabel('I have completed my stand-up'),
      ),
    ],
    embeds: [await makeEmbed()],
  };
};

export default {
  rule: () => jobFrequency({day: new Range(1, 5), hour: 12}, 'America/Bogota'),

  job: async (bot: Client) => {
    const channel = await insensitiveFindChannel(bot, '🤝general');

    if (!channel) {
      log.error('Could not find channel "🤝general"');
      return;
    }

    const source = await channel.send(await standupMessage());
    channel.send(
      '@everyone Remember to click the button to acknowledge that you have completed your stand-up.',
    );

    startStandupMonitor(bot, source, state.getParticipants());
    state.clearSkipQueue();
  },
};

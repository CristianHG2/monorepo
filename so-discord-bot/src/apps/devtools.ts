import {Client} from 'discord.js';
import standup from './standup';
import state from '../support/state';
import {clearStandup, remindPending} from './standup/participation';

export default {
  binders: [
    (bot: Client) => {
      bot.on('messageCreate', async message => {
        if (message.author.bot && !message.inGuild()) {
          return;
        }

        if (message.content === '!test-standup') {
          const scheduled = standup.scheduled[0];
          await scheduled.job(bot);

          await message.channel.send('Triggered standup manually');
        }

        if (message.content === '!print-state') {
          await message.channel.send(JSON.stringify(state.state));
        }

        if (message.content === '!current-system-time') {
          await message.channel.send(new Date().toString());
        }

        if (message.content === '!test-standup-reminder') {
          await remindPending(bot);
          await message.reply('Triggered reminder manually');
        }

        if (message.content === '!clear-standup') {
          clearStandup();

          await message.reply({
            content: 'Standup cleared.',
          });
        }
      });
    },
  ],
};

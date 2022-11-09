import {Client} from 'discord.js';
import dayjs from 'dayjs';

export default {
  binders: [
    (bot: Client) => {
      bot.on('messageCreate', async message => {
        if (message.author.bot && !message.inGuild()) {
          return;
        }

        if (message.content.startsWith('!set-meeting')) {
          const [, command, ...args] = message.content.split(' ');
          const meetStr = args.join(' ');

          const meetDate = dayjs(meetStr);
        }
      });
    },
  ],
};

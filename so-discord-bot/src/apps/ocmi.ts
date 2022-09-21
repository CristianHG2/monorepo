import {Client} from 'discord.js';
import {getNumbersWithTarget} from '../services/dialpad';
import {ray} from 'node-ray';
import {log} from 'loglevel';
import {Parser} from 'json2csv';

const isOcmiCommand = (message: string) => message.startsWith('!ocmi');

export default {
  binders: [
    (bot: Client) => {
      bot.on('messageCreate', async message => {
        if (message.author.bot && !message.inGuild()) {
          return;
        }

        if (isOcmiCommand(message.content)) {
          const [, command, ...args] = message.content.split(' ');

          if (command === 'dialpad-numbers') {
            await message.reply({
              content: 'Generating DID report...',
            });

            const csv = new Parser().parse(await getNumbersWithTarget());

            await message.channel.send({
              files: [
                {
                  name: 'departments.csv',
                  attachment: Buffer.from(csv),
                },
              ],
            });
          }
        }
      });
    },
  ],
};

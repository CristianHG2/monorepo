import {Client} from 'discord.js';

export default {
  binders: [
    (bot: Client) => {
      bot.on('messageCreate', async message => {
        if (message.author.bot && !message.inGuild()) {
          return;
        }

        if (message.content === '!poll') {
          const [, prompt] = message.content.split(' ');

          const poll = await message.channel.send({});
        }
      });
    },
  ],
};

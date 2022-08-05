import {Client} from 'discord.js';

export default {
  binders: [
    (bot: Client) => {
      const notAllowed = ['angular'];

      bot.on('messageCreate', async interaction => {
        if (interaction.author.bot || !interaction.inGuild()) {
          return;
        }

        notAllowed.some(i => interaction.content.toLowerCase().includes(i)) &&
          (await interaction.reply('No.'));
      });
    },
  ],
};

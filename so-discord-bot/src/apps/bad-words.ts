import {Client} from 'discord.js';

export default {
  apps: [
    (bot: Client) => {
      const notAllowed = ['angular', 'wordpress'];

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
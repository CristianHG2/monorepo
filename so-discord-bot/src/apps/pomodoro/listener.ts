import {Client} from 'discord.js';

export default (bot: Client) => {
  bot.on('messageCreate', async interaction => {
    if (!interaction.inGuild() || interaction.author.bot) {
      return;
    }

    if (interaction.content === '!pomodoro') {
    }
  });
};

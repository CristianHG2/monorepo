import {Client} from 'discord.js';
import {getAssignments, getSprints} from '../../services/notion/notion';

export default {
  binders: [
    (bot: Client) => {
      bot.on('messageCreate', async interaction => {
        if (interaction.author.bot || !interaction.inGuild()) {
          return;
        }

        if (interaction.content.startsWith('!notion-assignments')) {
          const [, ...argument] = interaction.content.split(' ');
          const sprint = argument.join(' ');

          const sprintId = (await getSprints()).find(s =>
            s.name.endsWith(sprint),
          )?.id;

          if (!sprintId) {
            await interaction.reply({
              content: `Sprint ${sprint} not found`,
            });
            return;
          }

          console.log(`Sprint ${sprint} found with id ${sprintId}`);

          const result = (await getAssignments(sprintId))
            .sort((a, b) => a.tasks - b.tasks)
            .map(result => `${result.name} - ${result.tasks} tasks`)
            .join('\n');

          await interaction.reply({
            content: `Here are the assignments for sprint ${sprint}:\n\n${result}`,
          });
        }
      });
    },
  ],
};

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

          const initialInteraction = await interaction.reply({
            content: `Please wait while I fetch the assignments for sprint ${sprint}...`,
          });

          const sprintId = (await getSprints()).find(s =>
            s.name.endsWith(sprint),
          )?.id;

          if (!sprintId) {
            await initialInteraction.edit({
              content: `Sprint ${sprint} not found`,
            });
            return;
          }

          const result = (await getAssignments(sprintId))
            .sort((a, b) => a.tasks - b.tasks)
            .map(result => `${result.name} - ${result.tasks} tasks`)
            .join('\n');

          await initialInteraction.edit({
            content: `Here are the assignments for sprint ${sprint}:\n\n${result}`,
          });
        }
      });
    },
  ],
};

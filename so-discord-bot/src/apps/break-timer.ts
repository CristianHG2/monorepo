import {Client, Message} from 'discord.js';
import log from 'loglevel';
import state from '../support/state';

const minute = (n: number) => (n > 1 ? 'minutes' : 'minute');

const createTimerIfNeeded = async (interaction: Message) => {
  const author = interaction.author;
  const message = interaction.content.match(/!break\s(\d+)/gm);

  if (!message) {
    return;
  }

  const time = parseInt(message[0].split(' ')[1]);

  await interaction.reply(
    `Break timer set for ${author.toString()}, see you in ${time} ${minute(
      time,
    )}!`,
  );

  log.info(
    `${author.toString()} set a break timer for ${time} ${minute(time)}`,
  );

  state.addBreakTimer(author.toString(), time, () => {
    log.info(`${author.toString()} finished their break`);

    interaction.channel.send(
      `${author.toString()}, break is over! Time to get this bread 🍞`,
    );
  });
};

export default {
  binders: [
    (bot: Client) => {
      bot.on('messageCreate', async interaction => {
        if (interaction.author.bot || !interaction.inGuild()) {
          return;
        }

        if (interaction.content.startsWith('!break')) {
          const currentTimer = state.getBreakTimer(
            interaction.author.toString(),
          );

          if (currentTimer) {
            await interaction.reply(
              `Your current break timer ends in ${
                currentTimer.minutes
              } ${minute(currentTimer.minutes)}!`,
            );
            return;
          }

          await createTimerIfNeeded(interaction);
        }
      });
    },
  ],
};

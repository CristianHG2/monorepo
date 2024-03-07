import axios from 'axios';
import {EmbedBuilder} from 'discord.js';

const getQuote = async () => {
  return (
    await axios.get<{content: string; author: string}>(
      'https://api.quotable.io/random',
    )
  ).data;
};

export const makeEmbed = async (): Promise<EmbedBuilder> => {
  const quote = await getQuote();

  return new EmbedBuilder()
    .setColor('#301934')
    .setTitle('🕒 Stand-up Time!')
    .setThumbnail('https://lifespikes-public-dist.s3.amazonaws.com/standup-meeting.png')
    .setFooter({text: `${quote.content}\n- ${quote.author}\n`})
    .addFields({
      name: "⚠️🔽 DON'T FORGET 🔽⚠️",
      value: [
        "- Don't be afraid to post your questions, big or small",
        '- Ask for additional info if you feel your task is underspecified',
        '- Share any comments you think would be helpful',
        '- Post anything you want to share with the team!! 🥂',
      ].join(`\n`)
    })
    .setDescription(
      [
        'Hi team, please provide a quick update about your tasks along with any questions you have.',
        '**🙏 Please respond within the next hour 🙏**\n\n',
      ].join(`\n\n`)
    );
};

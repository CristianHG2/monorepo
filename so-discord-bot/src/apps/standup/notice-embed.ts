import axios from 'axios';
import {MessageEmbed} from 'discord.js';

const getQuote = async () => {
  return (
    await axios.get<{content: string; author: string}>(
      'https://api.quotable.io/random',
    )
  ).data;
};

export const makeEmbed = async (): Promise<MessageEmbed> => {
  const quote = await getQuote();

  return new MessageEmbed({
    color: 'DARK_PURPLE',
    title: '🕒 Stand-up Time!',
    thumbnail: {
      url: 'https://lifespikes-public-dist.s3.amazonaws.com/standup-meeting.png',
    },
    footer: {
      text: `${quote.content}\n- ${quote.author}\n`,
    },
    fields: [
      {
        name: "⚠️🔽 DON'T FORGET 🔽⚠️",
        value: [
          "- Don't be afraid to post your questions, big or small",
          '- Ask for additional info if you feel your task is underspecified',
          '- Share any comments you think would be helpful',
          '- Post anything you want to share with the team!! 🥂',
        ].join(`\n`),
        inline: true,
      },
    ],
    description: [
      'Hi team, please provide a quick update about your tasks along with any questions you have.',
      '**🙏 Please respond within the next hour 🙏**\n\n',
    ].join(`\n\n`),
  });
};

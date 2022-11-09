import {BotApp} from '../types/apps';
import {Range} from 'node-schedule';
import {jobFrequency} from '../support/scheduler';
import {getAccessToken} from '../services/quickbooks/oauth';
import state from '../support/state';
import dayjs from 'dayjs';
import axios, {AxiosError} from 'axios';
import log from 'loglevel';
import {Client} from 'discord.js';
import {insensitiveFindChannel} from '../services/discord/helpers';

const apiRequest = async (
  endpoint: string,
  config: Record<string, any> = {},
) => {
  const accessToken = (await getAccessToken()).access_token;
  const realmId = process.env.QUICKBOOKS_REALM_ID;

  try {
    return (
      await axios.request({
        url: `https://quickbooks.api.intuit.com/v3/company/${realmId}/${endpoint}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        ...config,
      })
    ).data;
  } catch (error) {
    if (error instanceof AxiosError) {
      log.error(error.config, error.response?.status, error.response?.data);
      process.exit(1);
    } else {
      throw error;
    }
  }
};

const getOverdueInvoices = async () => {
  const now = dayjs().format('YYYY-MM-DD');
  return (
    await apiRequest('query', {
      params: {
        query: `SELECT * FROM Invoice WHERE DueDate < '${now}' AND Balance > '0'`,
        minorversion: 65,
      },
    })
  ).QueryResponse.Invoice;
};

const sendInvoiceReminder = async (invoiceId: string) => {
  return await apiRequest(`invoice/${invoiceId}/send`, {
    method: 'POST',
  });
};

const remindAllOverdue = async (bot: Client) => {
  const invoices = await getOverdueInvoices();
  const channel = await insensitiveFindChannel(bot, 'bot-dev');

  for (const invoice of invoices) {
    const msg = `Sent reminder for invoice ID ${invoice.Id} - #${invoice.DocNumber}`;
    log.debug(`SENDING - ${msg}`);
    await sendInvoiceReminder(invoice.Id);
    await channel.send(msg);
  }
};

const invoice: BotApp = {
  scheduled: [
    {
      rule: () =>
        jobFrequency({day: new Range(1, 5), hour: 9}, 'America/New_York'),
      job: async bot => {
        await remindAllOverdue(bot);
      },
    },
  ],
  binders: [
    bot => {
      bot.on('messageCreate', async message => {
        if (message.content === '!force-qbo-auth') {
          console.log(await getAccessToken(true));
        }

        if (message.content === '!clear-quickbooks-api') {
          state.cacheDelete('quickbooks-api');
        }

        if (message.content === '!get-overdue-invoices') {
          console.log(await getOverdueInvoices());
        }

        if (message.content === '!remind-overdue-invoices') {
          await remindAllOverdue(bot);
        }
      });
    },
  ],
};

export default invoice;

import {Client} from 'discord.js';
import schedule, {Range, RecurrenceRule} from 'node-schedule';
import log from 'loglevel';
import dayjs, {QUnitType} from 'dayjs';

const processesIn = (rule: RecurrenceRule) => {
  const nextInv = (u: QUnitType) =>
    dayjs(rule.nextInvocationDate(new Date())).diff(new Date(), u);

  const hours = nextInv('hour');
  const minutes = nextInv('minute') - hours * 60;

  return `${hours}h${minutes}m`;
};

export const prepareJob = (
  bot: Client,
  key: string,
  rule: RecurrenceRule,
  callback: (bot: Client) => void,
) => {
  log.info(`Job ${key} is scheduled to run in ${processesIn(rule)}`);

  schedule.scheduleJob(rule, () => {
    log.info(`Executing job ${key}, next run in ${processesIn(rule)}`);
    callback(bot);
  });
};

type Frequencies = {[key: string]: string | Range | number | undefined};

export const jobFrequency = (
  {date, day, hour, minute}: Frequencies,
  tz?: string,
) => {
  return new RecurrenceRule(
    undefined,
    undefined,
    date,
    day,
    hour,
    minute ?? 0,
    undefined,
    tz ?? 'America/New_York',
  );
};

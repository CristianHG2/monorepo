import {RecurrenceRule} from 'node-schedule';
import {Client} from 'discord.js';

export interface BotBind {
  (bot: Client): void;
}

export interface ScheduledJob {
  rule: () => RecurrenceRule;
  job: BotBind;
}

export interface BotApp {
  binders?: BotBind[];
  scheduled?: ScheduledJob[];
}

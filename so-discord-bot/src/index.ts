process.env.TZ = 'America/Bogota';

import 'dotenv/config';
import setUpLogger from './support/debug/logger';
import {startDiscordBot} from './services/discord';
import {prepareJob} from './support/scheduler';
import state from './support/state';
import badWords from './apps/bad-words';
import standup from './apps/standup';
import devtools from './apps/devtools';
import breakTimer from './apps/break-timer';
import {BotApp} from './types/apps';
import log from 'loglevel';
import dayjs, {QUnitType} from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

setUpLogger('debug');

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const enabledApps = {
  badWords,
  standup,
  devtools,
  breakTimer,
};

(async () => {
  /* Boot */
  const client = await startDiscordBot(process.env.DISCORD_BOT_TOKEN);
  const apps = Object.entries(enabledApps as Record<string, BotApp>);

  /* Prepare support components */
  state.setClient(client).load();

  log.info(`Loading ${apps.length} apps...`);

  for (const [name, app] of apps) {
    log.debug(`Preparing bot app ${name}`);

    app.binders?.forEach(bind => bind(client));
    app.scheduled?.forEach(job =>
      prepareJob(client, name, job.rule(), job.job),
    );
  }
})();

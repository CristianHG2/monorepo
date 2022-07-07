import 'dotenv/config';
import setUpLogger from './support/debug/logger';
import {startDiscordBot} from './services/discord';
import {prepareJob} from './support/scheduler';
import state from './support/state';
import badWords from './apps/bad-words';
import standup from './apps/standup';
import {BotApp} from './types/apps';
import log from 'loglevel';

setUpLogger('debug');

(async () => {
  /* Boot */
  const client = await startDiscordBot(process.env.DISCORD_BOT_TOKEN);
  const apps = {badWords, standup} as Record<string, BotApp>;

  /* Prepare support components */
  state.setClient(client).load();

  Object.entries(apps).forEach(([name, app]) => {
    log.debug(`Preparing bot app ${name}`);

    app.binders?.forEach(bind => bind(client));

    app.scheduled?.forEach(job =>
      prepareJob(client, name, job.rule(), job.job),
    );
  });
})();

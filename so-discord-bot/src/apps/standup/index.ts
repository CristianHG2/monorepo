import dailyStandup from './daily-job';
import standupCtl from './standup-ctl';

export default {
  scheduled: [dailyStandup],
  binders: [standupCtl],
};

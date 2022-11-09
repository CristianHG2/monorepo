import * as fs from 'fs';
import log from 'loglevel';
import {Client} from 'discord.js';
import {StandupParticipant, State} from '../types/state';

type BreakTimer = {
  minuteTimer: NodeJS.Timer;
  mainTimer: NodeJS.Timer;
  minutes: number;
};

export default new (class {
  public state: State;
  public client?: Client;

  public guildId: string = '870497948763566090';

  public standupTimer: NodeJS.Timer | undefined;
  public standupReminder: NodeJS.Timer | undefined;
  public breakTimers: Record<string, BreakTimer> = {};

  constructor() {
    this.state = {
      standup: {
        in_progress: false,
        pending: [],
        participants: [],
        skip_next: [],
      },
      cache: {},
    };

    process.on('exit', () => {
      this.persist();
    });

    setInterval(() => {
      this.persist();
    }, 10000);
  }

  addSlice(state: Record<string, unknown>) {
    this.state = {...this.state, ...{slice: state}};
    return this.state;
  }

  cache(key: string, value: unknown) {
    this.state.cache[key] = value;
    return this;
  }

  cacheHas(key: string) {
    return (this.state.cache ?? {}).hasOwnProperty(key);
  }

  cacheDelete(key: string) {
    this.state.cache = {};
    return this;
  }

  addBreakTimer(id: string, minutes: number, cb: () => void) {
    this.breakTimers[id] = {
      minutes,

      minuteTimer: setInterval(() => {
        this.breakTimers[id].minutes--;
      }, 60 * 1000),

      mainTimer: setTimeout(() => {
        cb();
        this.removeBreakTimer(id);
      }, minutes * 60 * 1000),
    };
  }

  getBreakTimer(id: string) {
    return this.breakTimers[id];
  }

  removeBreakTimer(id: string) {
    clearInterval(this.breakTimers[id].minuteTimer);
    clearTimeout(this.breakTimers[id].mainTimer);

    delete this.breakTimers[id];
  }

  setTimer(name: 'standupTimer' | 'standupReminder', timer: NodeJS.Timer) {
    this[name] = timer;
  }

  getTimer(name: 'standupTimer' | 'standupReminder') {
    return this[name];
  }

  setClient(client: Client) {
    this.client = client;
    return this;
  }

  startStandup(participants: StandupParticipant[]) {
    this.state.standup.in_progress = true;
    this.state.standup.pending = participants;
  }

  skipDuringNextStandup(participant: StandupParticipant) {
    if (!this.state.standup.skip_next) {
      this.state.standup.skip_next = [];
    }

    this.state.standup.skip_next.push(participant);
  }

  clearSkipQueue() {
    this.state.standup.skip_next = [];
  }

  getParticipants() {
    return this.state.standup.participants.filter(
      p => !this.state.standup.skip_next.some(s => s.id === p.id),
    );
  }

  removeFromActiveStandup(participant: StandupParticipant) {
    this.state.standup.pending = this.state.standup.pending.filter(
      e => e.id !== participant.id,
    );
  }

  addParticipant(id: StandupParticipant) {
    this.state.standup.participants.push(id);
  }

  standupActive() {
    return this.state.standup.in_progress;
  }

  stopStandup() {
    this.state.standup.in_progress = false;
    this.state.standup.pending = [];
  }

  markAcknowledged(participant: StandupParticipant) {
    this.state.standup.pending = this.state.standup.pending.filter(
      e => e.id !== participant.id,
    );
  }

  getPendingParticipants() {
    return this.state.standup.pending;
  }

  listParticipants() {
    return this.getParticipants();
  }

  removeParticipant(id: StandupParticipant) {
    this.state.standup.participants = this.state.standup.participants.filter(
      e => e.id !== id.id,
    );
  }

  load() {
    fs.readFile('./state.json', (err, data) => {
      if (err) {
        log.debug('no persisted state, starting fresh');
        return;
      }

      try {
        this.state = JSON.parse(data.toString());
        log.debug('state loaded');
      } catch (e) {
        if (e instanceof SyntaxError) {
          log.error('failed to parse state.json, starting fresh');
          fs.writeFileSync('./state.json', '{}');

          this.load();
        }
      }
    });
  }

  persist() {
    fs.writeFile('./state.json', JSON.stringify(this.state), () =>
      log.trace('state persisted'),
    );
  }
})();

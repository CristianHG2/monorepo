import * as fs from 'fs';
import log from 'loglevel';
import {Client} from 'discord.js';
import {StandupParticipant, State} from '../types/state';

export default new (class {
  public state: State;
  public client?: Client;

  public guildId: string = '870497948763566090';

  constructor() {
    this.state = {
      standup: {
        in_progress: false,
        pending: [],
        participants: [],
      },
    };

    setInterval(() => {
      this.persist();
    }, 10000);
  }

  setClient(client: Client) {
    this.client = client;
    return this;
  }

  startStandup(participants: StandupParticipant[]) {
    this.state.standup.in_progress = true;
    this.state.standup.pending = participants;
  }

  getParticipants() {
    return this.state.standup.participants;
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
    return this.state.standup.participants;
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

      this.state = JSON.parse(data.toString());
      log.debug('state loaded');
    });
  }

  persist() {
    fs.writeFile('./state.json', JSON.stringify(this.state), () => {
      log.debug('state persisted');
    });
  }
})();

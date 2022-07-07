export type StandupParticipant = {
  id: string;
};

export type Standup = {
  in_progress: boolean;
  pending: StandupParticipant[];
  participants: StandupParticipant[];
};

export type State = {
  standup: Standup;
};

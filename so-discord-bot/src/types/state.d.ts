export type StandupParticipant = {
  id: string;
};

export type Standup = {
  in_progress: boolean;
  pending: StandupParticipant[];
  participants: StandupParticipant[];
  skip_next: StandupParticipant[];
};

export type State = {
  standup: Standup;
  cache: Record<string, unknown>;
};

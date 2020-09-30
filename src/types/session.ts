export type SessionSpeaker = {
  name: string;
};

export type SessionTag = string;

export interface Session {
  id: string;
  start_date: number;
  end_date: number;
  title: string;
  description: string | null;
  speakers: SessionSpeaker[] | null;
  tags: { name: SessionTag }[] | null;
  signalTv?: boolean;
  url?: string;
}

export interface AugmentedSession extends Session {
  isLiveSession: boolean;
  isSignalTv: boolean;
  canRegister: boolean;
}

export type SignalTvApiResponseSession = {
  id: string;
  title: string;
  description: string;
  talent: string;
  start: number;
  end: number;
  tags: [{ name: 'SIGNAL TV' }];
};

export type SignalTvApiResponse = SignalTvApiResponseSession[];

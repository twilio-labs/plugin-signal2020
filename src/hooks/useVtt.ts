import webvtt from 'node-webvtt';
import { useEffect, useState } from 'react';

export type Cue = {
  start: number;
  end: number;
  text: string;
};
export type VttInfo = {
  cues: Cue[];
};

export function useVtt(vttString: string): VttInfo {
  const [vtt, setVtt] = useState<VttInfo>({ cues: [] });
  useEffect(() => {
    const parsed = webvtt.parse(vttString) as VttInfo;
    parsed.cues = parsed.cues.map<Cue>(
      (c: Cue): Cue => {
        return { ...c, start: c.start * 1000, end: c.end * 1000 };
      }
    );
    setVtt(parsed);
  }, [vttString]);
  return vtt;
}

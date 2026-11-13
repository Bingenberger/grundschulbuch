// Routes the reference's callbacks to the correct notebook element.
import { musicRegister } from '../reference/music-runtime';
export type MusicClient = {
  sequence: (value: unknown) => void;
  studio: (value: unknown) => void;
  add: (kind: string, at: number) => void;
  edit: (index: number) => void;
  record: (track: number) => void;
  pad: (index: number) => void;
  karaokeAudio: (take: { blob: Blob }, timing: unknown) => void;
  karaokeTiming: (timing: unknown) => void;
};
const clients = new Map<string, MusicClient>();
musicRegister(
  (id: string, value: unknown) => clients.get(id)?.sequence(value),
  (id: string, value: unknown) => clients.get(id)?.studio(value),
  (id: string, kind: string, at: number) => clients.get(id)?.add(kind, at),
  (id: string, index: number) => clients.get(id)?.edit(index),
  (id: string, track: number) => clients.get(id)?.record(track),
  (id: string, index: number) => clients.get(id)?.pad(index),
  (id: string, take: { blob: Blob }, timing: unknown) => clients.get(id)?.karaokeAudio(take, timing),
  (id: string, timing: unknown) => clients.get(id)?.karaokeTiming(timing),
);
export function registerMusic(id: string, client: MusicClient) {
  clients.set(id, client);
  return () => { if (clients.get(id) === client) clients.delete(id); };
}

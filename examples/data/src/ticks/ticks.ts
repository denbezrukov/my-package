import ticks from './ticks_data.json';

export interface Tick {
  low: number;
  high: number;
  close: number;
  open: number;
}

interface ProtoTick {
  l: number;
  h: number;
  c: number;
  o: number;
}

export const ticksList: Tick[] = (ticks as ProtoTick[]).map((tick) => {
  return {
    low: tick.l,
    high: tick.h,
    close: tick.c,
    open: tick.o,
  };
});

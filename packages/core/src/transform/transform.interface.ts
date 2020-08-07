import { InterpolatorFactory } from 'd3-scale';

export interface Scale<T> {
  (value: T): number;
  range(): [number, number];
  range(range: [number, number]): this;
  interpolate(interpolate: InterpolatorFactory<number, number>): this;
  ticks(count: number): T[];
  tickFormat(): (d: T) => string;
}

export interface TransformerConfig<T> {
  scale: Scale<T>;
}

export interface Transformer<T> {
  transform: Scale<T>;
  setShift: (setShift: (shift: number) => number) => void;
  setScale: (setScale: (scale: number) => number) => void;
}

export interface Point {
  x: number;
  y: number;
}

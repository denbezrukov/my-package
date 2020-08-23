import { InterpolatorFactory } from 'd3-scale';

export interface Scale<Domain> {
  (value: Domain): number;
  invert(value: number): Domain;
  domain(): Domain[];
  range(): number[];
  range(range: number[]): this;
  interpolate(interpolate: InterpolatorFactory<number, number>): this;
  ticks(count?: number): Domain[];
  tickFormat(): (d: Domain) => string;
}

export interface TransformerConfig<Domain> {
  scale: Scale<Domain>;
}

export interface Transformer<Domain> {
  transform: Scale<Domain>;
  setShift: (setShift: (shift: number) => number) => void;
  setScale: (setScale: (scale: number) => number) => void;
  setScaleOffset: (setScaleOffset: (scaleOffset: number) => number) => void;
}

export interface Point {
  x: number;
  y: number;
}

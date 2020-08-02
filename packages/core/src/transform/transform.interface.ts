import { ScaleContinuousNumeric } from 'd3-scale';

export interface TransformerConfig {
  domain: [number, number];
  range: [number, number];
}

export interface Transformer {
  transform: ScaleContinuousNumeric<number, number>;
  setShift: (setShift: (shift: number) => number) => void;
  setScale: (setScale: (scale: number) => number) => void;
}

export interface Point {
  x: number;
  y: number;
}

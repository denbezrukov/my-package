import { ScaleContinuousNumeric } from 'd3-scale';

export interface ScaleConfig {
  domain: [number, number];
  range: [number, number];
}

export interface Scale {
  transform: ScaleContinuousNumeric<number, number>;
  setShift: (setShift: (shift: number) => number) => void;
  setScale: (setScale: (scale: number) => number) => void;
}

export interface Point {
  x: number;
  y: number;
}

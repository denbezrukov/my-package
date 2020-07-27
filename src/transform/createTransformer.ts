import { scaleLinear } from 'd3-scale';
import { Transformer, TransformerConfig } from './transform.interface';

const interpolateCanvasRound = (a: number, b: number) => (t: number) => {
  return Math.round(a * (1 - t) + b * t) + 0.5;
};

export const createTransformer = (config: TransformerConfig): Transformer => {
  const { domain, range } = config;

  let shift = 0;
  let scale = 0;

  const transform = scaleLinear()
    .domain(domain)
    .interpolate(interpolateCanvasRound);

  const updateTransform = () => {
    const [from, to] = range;

    const k = 1 + scale / (to - from);

    transform.range([from + shift, to * k + shift]);
  };

  const setShift: Transformer['setShift'] = (action) => {
    shift = action(shift);
    updateTransform();
  };

  const setScale: Transformer['setScale'] = (action) => {
    scale = action(scale);
    updateTransform();
  };

  updateTransform();

  return {
    transform,
    setShift,
    setScale,
  };
};

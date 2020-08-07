import { Transformer, TransformerConfig } from './transform.interface';

const interpolateCanvasRound = (a: number, b: number) => (t: number) => {
  return Math.round(a * (1 - t) + b * t) + 0.5;
};

export const createTransformer = <T>(
  config: TransformerConfig<T>,
): Transformer<T> => {
  const { scale } = config;

  let shift = 0;
  let scaleRange = 0;

  const transform = scale.interpolate(interpolateCanvasRound);

  const range = scale.range();

  const updateTransform = () => {
    const [from, to] = range;

    const k = 1 + scaleRange / (to - from);
    transform.range([from + shift, to * k + shift]);
    // const offset = transform.range(range)(0);
    //
    // transform.range([
    //   from * k + offset * (1 - k) + shift,
    //   to * k + offset * (1 - k) + shift,
    // ]);
  };

  const setShift: Transformer<T>['setShift'] = (action) => {
    shift = action(shift);
    updateTransform();
  };

  const setScale: Transformer<T>['setScale'] = (action) => {
    scaleRange = action(scaleRange);
    updateTransform();
  };

  updateTransform();

  return {
    transform,
    setShift,
    setScale,
  };
};

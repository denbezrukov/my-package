import { Transformer, TransformerConfig } from './transform.interface';

const interpolateCanvasRound = (a: number, b: number) => (t: number) => {
  return Math.round(a * (1 - t) + b * t) + 0.5;
};

export const createTransformer = <Domain>(
  config: TransformerConfig<Domain>,
): Transformer<Domain> => {
  const { scale } = config;
  const range = scale.range();
  const domain = scale.domain();

  let shift = 0;
  let scaleRange = 0;
  let scaleOffset = domain[0];

  const transform = scale.interpolate(interpolateCanvasRound);

  const getRange = () => {
    const [from, to] = range;

    const k = 1 + scaleRange / (to - from);
    const offset = transform.range(range)(scaleOffset);

    return [
      from * k + offset * (1 - k) + shift,
      to * k + offset * (1 - k) + shift,
    ];
  };

  const updateTransform = () => {
    transform.range(getRange());
  };

  const setShift: Transformer<Domain>['setShift'] = (action) => {
    shift = action(shift);
    updateTransform();
  };

  const setScale: Transformer<Domain>['setScale'] = (action) => {
    scaleRange = action(scaleRange);
    updateTransform();
  };

  const setScaleOffset: Transformer<Domain>['setScaleOffset'] = (action) => {
    const prevValue = transform(scaleOffset);
    const nextValue = action(prevValue);
    scaleOffset = transform.invert(nextValue);
    const [current] = transform.range();
    const [next] = getRange();
    shift += current - next;
    updateTransform();
  };

  updateTransform();

  return {
    transform,
    setShift,
    setScale,
    setScaleOffset,
  };
};

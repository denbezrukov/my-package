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
  let offsetPoint = domain[0];

  const transform = scale.interpolate(interpolateCanvasRound);

  const updateTransform = () => {
    const [from, to] = range;

    const k = 1 + scaleRange / (to - from);
    const offset = transform.range(range)(offsetPoint);

    transform.range([
      from * k + offset * (1 - k) + shift,
      to * k + offset * (1 - k) + shift,
    ]);
  };

  const setShift: Transformer<Domain>['setShift'] = (action) => {
    shift = action(shift);
    updateTransform();
  };

  const setScale: Transformer<Domain>['setScale'] = (action) => {
    scaleRange = action(scaleRange);
    updateTransform();
  };

  const setOffset: Transformer<Domain>['setOffset'] = (action) => {
    offsetPoint = action(offsetPoint);
  };

  updateTransform();

  return {
    transform,
    setShift,
    setScale,
    setOffset,
  };
};

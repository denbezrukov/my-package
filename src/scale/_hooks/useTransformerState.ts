import { useMemo, useState } from 'react';
import { Scale, ScaleConfig } from '../scale.interface';
import { createTransformer } from '../createTransformer';

export const useTransformerState = (config: ScaleConfig): Scale => {
  const [transformer, setTransformer] = useState(() => {
    return createTransformer(config);
  });

  return useMemo(() => {
    const setShift: Scale['setShift'] = (action) => {
      transformer.setShift(action);
      setTransformer({
        ...transformer,
      });
    };

    const setScale: Scale['setScale'] = (action) => {
      transformer.setScale(action);
      setTransformer({
        ...transformer,
      });
    };

    return {
      transform: transformer.transform,
      setShift,
      setScale,
    };
  }, [transformer, setTransformer]);
};

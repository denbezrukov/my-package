import { useMemo, useState, useEffect, useRef } from 'react';
import { Transformer, TransformerConfig } from '../transform.interface';
import { createTransformer } from '../createTransformer';

export const useTransformerState = <Domain>(
  config: TransformerConfig<Domain>,
): Transformer<Domain> => {
  const [transformer, setTransformer] = useState(() => {
    return createTransformer(config);
  });

  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) {
      setTransformer(createTransformer(config));
    } else {
      ref.current = true;
    }
  }, [ref, setTransformer, config]);

  return useMemo(() => {
    const setShift: Transformer<Domain>['setShift'] = (action) => {
      transformer.setShift(action);
      setTransformer({
        ...transformer,
      });
    };

    const setScale: Transformer<Domain>['setScale'] = (action) => {
      transformer.setScale(action);
      setTransformer({
        ...transformer,
      });
    };

    const setScaleOffset: Transformer<Domain>['setScaleOffset'] = (action) => {
      transformer.setScaleOffset(action);
    };

    return {
      transform: transformer.transform,
      setShift,
      setScale,
      setScaleOffset,
    };
  }, [transformer, setTransformer]);
};

import { useMemo, useState, useEffect, useRef } from 'react';
import { Transformer, TransformerConfig } from '../transform.interface';
import { createTransformer } from '../createTransformer';

export const useTransformerState = (config: TransformerConfig): Transformer => {
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
    const setShift: Transformer['setShift'] = (action) => {
      transformer.setShift(action);
      setTransformer({
        ...transformer,
      });
    };

    const setScale: Transformer['setScale'] = (action) => {
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

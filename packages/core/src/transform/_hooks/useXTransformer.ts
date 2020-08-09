import { useContext } from 'react';
import { XTransformerContext } from '../transformerContext';
import { Transformer } from '../transform.interface';

export const useXTransformer = <Domain>() => {
  const transformer = useContext(XTransformerContext);

  if (transformer) {
    return transformer as Transformer<Domain>;
  }

  throw new Error('Transformer is undefined');
};

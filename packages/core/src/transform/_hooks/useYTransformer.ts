import { useContext } from 'react';
import { YTransformerContext } from '../transformerContext';
import { Transformer } from '../transform.interface';

export const useYTransformer = <Domain>() => {
  const transformer = useContext(YTransformerContext);

  if (transformer) {
    return transformer as Transformer<Domain>;
  }

  throw new Error('Transformer is undefined');
};

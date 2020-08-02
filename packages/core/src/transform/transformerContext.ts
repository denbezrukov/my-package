import { createContext } from 'react';
import { Transformer } from './transform.interface';

export const XTransformerContext = createContext<Transformer | undefined>(
  undefined,
);
export const YTransformerContext = createContext<Transformer | undefined>(
  undefined,
);

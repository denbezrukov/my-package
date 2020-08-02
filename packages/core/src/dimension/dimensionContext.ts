import { createContext } from 'react';
import { Dimension } from './dimension.interface';

export const DimensionContext = createContext<Dimension | undefined>(undefined);

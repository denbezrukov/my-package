import { createContext } from 'react';
import { Scale } from './scale.interface';

export const ScaleContext = createContext<Scale | undefined>(undefined);

import { StageProps } from 'react-konva';
import { Dimension } from '../dimension/dimension.interface';

export type InteractiveStageProps = Omit<StageProps, 'width' | 'height'> & {
  dimension: Dimension;
  xDomain: [number, number];
  yDomain: [number, number];
};

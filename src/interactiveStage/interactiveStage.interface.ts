import { StageProps } from 'react-konva';

export type InteractiveStageProps = StageProps & {
  xDomain: [number, number];
  yDomain: [number, number];
};

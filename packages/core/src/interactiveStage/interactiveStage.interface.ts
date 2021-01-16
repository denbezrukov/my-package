import { StageProps } from 'react-konva';

export type InteractiveStageProps = Omit<StageProps, 'width' | 'height'> & {
  fill?: string;
  disableYInteraction?: boolean;
  disableXInteraction?: boolean;
};

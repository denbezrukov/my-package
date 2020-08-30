import { StageProps } from 'react-konva';

export type InteractiveStageProps = Omit<StageProps, 'width' | 'height'> & {
  disableYInteraction?: boolean;
  disableXInteraction?: boolean;
};

import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { FirstChart } from '../first';
// import { TransformerConfig } from '../../../../packages/core/src/transform/transform.interface';
// import { useTransformerState } from '../../../../packages/core/src/transform/_hooks/useTransformerState';
// import { Stage } from 'react-konva';
// import { DimensionContext } from '../../../../packages/core/src/dimension/dimensionContext';
// import { XTransformerContext } from '../../../../packages/core/src/transform/transformerContext';
// import { XInteractionStage } from '../../../../packages/core/src/axis/__stories__/axis.story';
//
storiesOf('First Chart', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return <FirstChart />;
  });
//   .add('XAxis', () => {
//     const width = number('width', 400);
//     const height = number('height', 400);
//     const size = number('size', 20);
//     const from = number('from', 0);
//     const to = number('to', 100);
//
//     const config = useMemo<TransformerConfig>(() => {
//       return {
//         domain: [from, to],
//         range: [0, width],
//       };
//     }, [from, to, width]);
//
//     const transformer = useTransformerState(config);
//
//     const dimension = useMemo(() => {
//       return {
//         width,
//         height,
//         yAxisSize: 0,
//         xAxisSize: size,
//       };
//     }, [width, height, size]);
//
//     return (
//       <Stage width={width} height={height}>
//         <DimensionContext.Provider value={dimension}>
//           <XTransformerContext.Provider value={transformer}>
//             <XInteractionStage />
//           </XTransformerContext.Provider>
//         </DimensionContext.Provider>
//       </Stage>
//     );
//   });

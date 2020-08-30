import Konva from 'konva';

const virtualText = new Konva.Text();
const dictionary: Record<
  string,
  { width: number; height: number } | undefined
> = {};

export const getTextSize = (text: string /* , fontSize = 12 */) => {
  let width = 0;
  let height = 0;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (!dictionary[char]) {
      virtualText.text(char);
      // virtualText.fontSize(fontSize);
      dictionary[char] = {
        width: virtualText.textWidth,
        height: virtualText.textHeight,
      };
    }

    const value = dictionary[char];

    if (value) {
      width += value.width;
      height = Math.max(value.height, height);
    }
  }

  return {
    width: Math.ceil(width),
    height: Math.ceil(height),
  };
};

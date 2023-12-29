import React from 'react';
import { RatingColor, getRatingColorCode } from './utils';

export type RatingMetalColor = 'Bronze' | 'Silver' | 'Gold';
const getRatingMetalColorCode = (metalColor: RatingMetalColor) => {
  switch (metalColor) {
    case 'Bronze':
      return { base: '#965C2C', highlight: '#FFDABD' };
    case 'Silver':
      return { base: '#808080', highlight: '#FFFFFF' };
    case 'Gold':
      return { base: '#FFD700', highlight: '#FFFFFF' };
  }
};

type RatingColorWithMetal = RatingColor | RatingMetalColor;
const getStyleOptions = (color: RatingColorWithMetal, fillRatio: number) => {
  if (color === 'Bronze' || color === 'Silver' || color === 'Gold') {
    const metalColor = getRatingMetalColorCode(color);
    return {
      borderColor: metalColor.base,
      background: `linear-gradient(to right, \
        ${metalColor.base}, ${metalColor.highlight}, ${metalColor.base})`,
    };
  } else {
    const colorCode = getRatingColorCode(color);
    return {
      borderColor: colorCode,
      background: `border-box linear-gradient(to top, \
        ${colorCode} ${fillRatio * 100}%, \
        rgba(0,0,0,0) ${fillRatio * 100}%)`,
    };
  }
};

interface Props extends React.HTMLAttributes<HTMLElement> {
  color: RatingColorWithMetal;
  rating: number;
}

export const TopcoderLikeCircle: React.FC<Props> = (props) => {
  const { color, rating } = props;
  const fillRatio = rating >= 3200 ? 1.0 : (rating % 400) / 400;
  const styleOptions = getStyleOptions(color, fillRatio);

  return (
    <span
      className='inline-block align-sub rounded-full border border-solid w-3.5 h-3.5 bg-origin-border'
      style={styleOptions}
    ></span>
  );
};

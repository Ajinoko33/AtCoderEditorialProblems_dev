export const clipDifficulty = (difficulty: number): number =>
  Math.round(
    difficulty >= 400 ? difficulty : 400 / Math.exp(1.0 - difficulty / 400),
  );

export const RatingColors = [
  'Black',
  'Grey',
  'Brown',
  'Green',
  'Cyan',
  'Blue',
  'Yellow',
  'Orange',
  'Red',
] as const;

export type RatingColor = (typeof RatingColors)[number];
export const getRatingColor = (rating: number): RatingColor => {
  const index = Math.min(Math.floor(rating / 400), RatingColors.length - 2);
  return RatingColors[index + 1];
};
export type RatingColorClassName =
  | 'difficulty-black'
  | 'difficulty-grey'
  | 'difficulty-brown'
  | 'difficulty-green'
  | 'difficulty-cyan'
  | 'difficulty-blue'
  | 'difficulty-yellow'
  | 'difficulty-orange'
  | 'difficulty-red';
export const getRatingColorClass = (rating: number): RatingColorClassName => {
  const ratingColor = getRatingColor(rating);
  switch (ratingColor) {
    case 'Black':
      return 'difficulty-black';
    case 'Grey':
      return 'difficulty-grey';
    case 'Brown':
      return 'difficulty-brown';
    case 'Green':
      return 'difficulty-green';
    case 'Cyan':
      return 'difficulty-cyan';
    case 'Blue':
      return 'difficulty-blue';
    case 'Yellow':
      return 'difficulty-yellow';
    case 'Orange':
      return 'difficulty-orange';
    case 'Red':
      return 'difficulty-red';
  }
};
export const theme = {
  difficultyBlackColor: '#404040',
  difficultyGreyColor: '#808080',
  difficultyBrownColor: '#804000',
  difficultyGreenColor: '#008000',
  difficultyCyanColor: '#00C0C0',
  difficultyBlueColor: '#0000FF',
  difficultyYellowColor: '#C0C000',
  difficultyOrangeColor: '#FF8000',
  difficultyRedColor: '#FF0000',
};
export const getRatingColorCode = (ratingColor: RatingColor): string => {
  switch (ratingColor) {
    case 'Black':
      return theme.difficultyBlackColor;
    case 'Grey':
      return theme.difficultyGreyColor;
    case 'Brown':
      return theme.difficultyBrownColor;
    case 'Green':
      return theme.difficultyGreenColor;
    case 'Cyan':
      return theme.difficultyCyanColor;
    case 'Blue':
      return theme.difficultyBlueColor;
    case 'Yellow':
      return theme.difficultyYellowColor;
    case 'Orange':
      return theme.difficultyOrangeColor;
    case 'Red':
      return theme.difficultyRedColor;
  }
};

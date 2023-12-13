export type Problem = {
  contest: string;
  category: 'ABC' | 'ARC';
  title: string;
  difficulty?: number;
  startEpochSecond: number;
  sortOrder: number;
  resultCode: number;
};

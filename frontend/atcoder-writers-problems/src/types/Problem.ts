export const categories = ['ABC', 'ARC'] as const;
export type Category = (typeof categories)[number];

export type Problem = {
  contest: string;
  category: Category;
  title: string;
  difficulty?: number;
  startEpochSecond: number;
  sortOrder: number;
  resultCode: number;
};

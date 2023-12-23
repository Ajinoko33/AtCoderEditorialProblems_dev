export const categories = ['ABC', 'ARC'] as const;
export type Category = (typeof categories)[number];

export type ProblemResponse = {
  id: string;
  contest: string;
  category: Category;
  title: string;
  difficulty?: number;
  start_epoch_second: number;
  sort_order: number;
  resultCode?: number; // 1: AC, 2: 1回以上の提出かつ未AC, undefined: 未提出
};

type OmitProps = 'start_epoch_second' | 'sort_order';
export type Problem = Omit<ProblemResponse, OmitProps> & {
  startEpochSecond: number;
  sortOrder: number;
};

export const createProblemFromProblemResponse = (
  src: ProblemResponse,
): Problem => ({
  id: src.id,
  contest: src.contest,
  category: src.category,
  title: src.title,
  difficulty: src.difficulty,
  resultCode: src.resultCode,
  startEpochSecond: src.start_epoch_second,
  sortOrder: src.sort_order,
});

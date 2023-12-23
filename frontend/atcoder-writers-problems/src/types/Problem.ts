export const categories = ['ABC', 'ARC'] as const;
export type Category = (typeof categories)[number];

export type ResultCode = 'AC' | 'Trying' | 'Yet';

export type ProblemResponse = {
  id: string;
  contest: string;
  category: Category;
  title: string;
  difficulty?: number;
  start_epoch_second: number;
  sort_order: number;
  result_code?: ResultCode;
};

type OmitProps = 'start_epoch_second' | 'sort_order' | 'result_code';
export type Problem = Omit<ProblemResponse, OmitProps> & {
  startEpochSecond: number;
  sortOrder: number;
  resultCode: ResultCode;
};

export const createProblemFromProblemResponse = (
  src: ProblemResponse,
): Problem => ({
  id: src.id,
  contest: src.contest,
  category: src.category,
  title: src.title,
  difficulty: src.difficulty,
  startEpochSecond: src.start_epoch_second,
  sortOrder: src.sort_order,
  resultCode: src.result_code || 'Yet',
});

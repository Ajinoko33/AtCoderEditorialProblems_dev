export const categories = ['ABC', 'ARC'] as const;
export type Category = (typeof categories)[number];

export type ResultCode = 'AC' | 'Trying' | 'Yet';

export const problemsIndexs = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'F2',
  'G',
  'H',
  'Ex',
] as const;
export type ProblemIndex = (typeof problemsIndexs)[number];
const problemIndexOrders = {
  A: 10,
  B: 20,
  C: 30,
  D: 40,
  E: 50,
  F: 60,
  F2: 61,
  G: 70,
  H: 80,
  Ex: 81,
};
export const getProblemIndexOrder = (problemIndex: ProblemIndex) =>
  problemIndexOrders[problemIndex];

export type ProblemResponse = {
  id: string;
  contest: string;
  category: Category;
  name: string;
  difficulty?: number;
  start_epoch_second: number;
  result_code?: ResultCode;
  problem_index: ProblemIndex;
};

type OmitProps = 'start_epoch_second' | 'result_code' | 'problem_index';
export type Problem = Omit<ProblemResponse, OmitProps> & {
  startEpochSecond: number;
  resultCode: ResultCode;
  problemIndex: ProblemIndex;
};

export const createProblemFromProblemResponse = (
  src: ProblemResponse,
): Problem => ({
  id: src.id,
  contest: src.contest,
  category: src.category,
  name: src.name,
  difficulty: src.difficulty,
  startEpochSecond: src.start_epoch_second,
  resultCode: src.result_code || 'Yet',
  problemIndex: src.problem_index,
});

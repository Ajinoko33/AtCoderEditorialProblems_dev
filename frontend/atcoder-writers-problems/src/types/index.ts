/*========= Problem ==============================*/

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

/*========= Error ==============================*/

export type GlobalError = {
  message: string;
};

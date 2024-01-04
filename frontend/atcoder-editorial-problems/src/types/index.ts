/*========= Problem ==============================*/

export const categories = ['ABC', 'ARC'] as const;
export type Category = (typeof categories)[number];

export type ResultCode = 'AC' | 'Trying' | 'Yet';

export const editorialTypes = ['official', 'user'] as const;
export type EditorialType = (typeof editorialTypes)[number];

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
  editorial_types: EditorialType[];
  is_experimental: boolean;
};

type OmitProps =
  | 'start_epoch_second'
  | 'result_code'
  | 'problem_index'
  | 'editorial_types'
  | 'is_experimental';
export type Problem = Omit<ProblemResponse, OmitProps> & {
  startEpochSecond: number;
  resultCode: ResultCode;
  problemIndex: ProblemIndex;
  editorialTypes: EditorialType[];
  isExperimental: boolean;
};

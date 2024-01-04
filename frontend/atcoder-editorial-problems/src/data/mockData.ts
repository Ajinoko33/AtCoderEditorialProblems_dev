import {
  categories,
  type EditorialType,
  type Problem,
  type ProblemIndex,
  type ResultCode,
} from '@/types';

export const writersData: string[] = [
  'aaaa',
  'AAAAA',
  'BBAAAAAA',
  'BBBB',
  'cccc',
  'xxxxxxxxxxxxxxxxxxxx',
  '12345678901234567890',
];

export const writersDataOptions = writersData.map((name) => ({
  value: name,
  label: name,
}));

const resulteCodes: ResultCode[] = ['AC', 'Trying', 'Yet'];
const problemIndexs: ProblemIndex[] = ['A', 'B', 'C', 'D', 'E'];
const editorialTypeLists: EditorialType[][] = [
  ['official'],
  ['user'],
  ['official', 'user'],
];
export const problemsData: Problem[] = Array(50)
  .fill(null)
  .map((_, idx) => {
    const problem: Problem = {
      id: `${categories[Math.floor(idx / 5) % 2]}${100 + Math.floor(idx / 5)}_${
        problemIndexs[idx % 5]
      }`,
      contest: `${categories[Math.floor(idx / 5) % 2]}${
        100 + Math.floor(idx / 5)
      }`,
      category: categories[Math.floor(idx / 5) % 2],
      name: 'Everywhere is Sparser than Whole (Construction)',
      difficulty: idx % 4 ? 100 + idx * 10 : undefined,
      startEpochSecond: 111222333 + Math.floor(idx / 5),
      problemIndex: problemIndexs[idx % 5],
      resultCode: resulteCodes[idx % 3],
      editorialTypes: editorialTypeLists[idx % 3],
      isExperimental: idx % 3 == 0,
    };
    return problem;
  });

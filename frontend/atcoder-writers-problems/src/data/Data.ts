import { Problem, categories } from '@/types/Problem';

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

export const problemsData: Problem[] = Array(20)
  .fill(null)
  .map((_, idx) => {
    const problem: Problem = {
      contest: `${categories[idx % 2]}${300 - Math.floor(idx / 2)}`,
      category: categories[idx % 2],
      title: 'A. pow pow pow pow pow pow',
      difficulty: idx % 4 ? 50 : undefined,
      startEpochSecond: 111222333,
      sortOrder: idx / 2,
      resultCode: idx % 2,
    };
    return problem;
  });

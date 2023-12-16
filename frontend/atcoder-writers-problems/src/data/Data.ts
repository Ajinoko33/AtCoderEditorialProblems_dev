import { Problem } from '@/types/Problem';

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
      contest: idx % 2 ? `ABC${300 - idx / 2}` : `ARC${300 - idx / 2}`,
      category: idx % 2 ? 'ABC' : 'ARC',
      title: 'A. pow',
      difficulty: idx % 4 ? 50 : undefined,
      startEpochSecond: 111222333,
      sortOrder: idx / 2,
      resultCode: idx % 2,
    };
    return problem;
  });

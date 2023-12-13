import { Problem } from '@/types/Problem';
import { Writer } from '@/types/Writer';

export const writersData: Writer[] = [
  {
    id: 'aaaa',
  },
  {
    id: 'AAAAA',
  },
  {
    id: 'BBAAAAAA',
  },
  {
    id: 'BBBB',
  },
  {
    id: 'cccc',
  },
];

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

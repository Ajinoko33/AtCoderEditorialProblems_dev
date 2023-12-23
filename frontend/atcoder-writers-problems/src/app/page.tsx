'use client';

import { problemsData } from '@/data/Data';
import { Problem } from '@/types/Problem';
import { Divider, Flex } from 'antd';
import { useState } from 'react';
import { SearchForm } from './_components/SearchForm';
import { SearchResult } from './_components/SearchResult';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>(problemsData);

  const addProblem = () => {
    setProblems([
      ...problems,
      {
        contest: 'ABC999',
        category: 'ABC',
        title: 'A. xxx',
        difficulty: 200,
        startEpochSecond: 1000000,
        sortOrder: 1,
        resultCode: 1,
      },
      {
        contest: 'ARC999',
        category: 'ARC',
        title: 'A. xxx',
        difficulty: 200,
        startEpochSecond: 1000000,
        sortOrder: 1,
        resultCode: 1,
      },
    ]);
  };

  return (
    <Flex align='center' vertical>
      <SearchForm setProblems={setProblems} />
      <Divider />
      <SearchResult problems={problems} />
    </Flex>
  );
}

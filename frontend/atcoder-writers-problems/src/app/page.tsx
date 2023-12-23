'use client';

import { problemsData } from '@/data/Data';
import { Problem } from '@/types/Problem';
import { Divider, Flex } from 'antd';
import { useState } from 'react';
import { SearchForm } from './_components/SearchForm';
import { SearchResult } from './_components/SearchResult';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>(problemsData);

  return (
    <Flex align='center' vertical>
      <SearchForm setProblems={setProblems} />
      <Divider />
      <SearchResult problems={problems} />
    </Flex>
  );
}

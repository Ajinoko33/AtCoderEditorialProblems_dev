'use client';

import { problemsData, writersData } from '@/data/Data';
import { Flex } from 'antd';
import { useState } from 'react';
import { SearchForm } from './_components/SearchForm';
import { SearchResult } from './_components/SearchResult';

export default function Home() {
  const [writers, setWriters] = useState(writersData);
  const [problems, setProblems] = useState(problemsData);

  //TODO: problemsをABC,ARCに分ける

  //TODO: Form, Tabs を縦に並べる
  return (
    <Flex align='center' vertical>
      <SearchForm />
      <SearchResult />
    </Flex>
  );
}

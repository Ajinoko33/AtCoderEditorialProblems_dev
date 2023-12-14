'use client';

import { problemsData, writersData } from '@/data/Data';
import { useState } from 'react';

export default function Home() {
  const [writers, setWriters] = useState(writersData);
  const [problems, setProblems] = useState(problemsData);

  //TODO: problemsをABC,ARCに分ける

  //TODO: Form, Tabs を縦に並べる
  return (
    <div>
      <a href='https://google.com'>google</a>
      <a href='https://google.com'>google</a>
    </div>
  );
}

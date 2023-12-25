'use client';

import { problemsData } from '@/data/Data';
import type { Problem } from '@/types';
import { Alert, Divider, Flex } from 'antd';
import { useState } from 'react';
import { SearchForm } from './_components/SearchForm';
import { SearchResult } from './_components/SearchResult';

const ErrorMessages = {
  LoadingWriterError:
    'Failed to loading wirters. Reload this page to try again.',
  SearchingError: 'Failed to searching problems.',
};

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>(problemsData);
  const [isLoadingWritersError, setIsLoadingWritersError] =
    useState<boolean>(false);
  const [isSearchingError, setIsSearchingError] = useState<boolean>(false);

  return (
    <Flex align='center' vertical>
      {(isLoadingWritersError || isSearchingError) && (
        <div className='mb-8'>
          {isLoadingWritersError && (
            <Alert
              message={ErrorMessages.LoadingWriterError}
              type='error'
              showIcon
            />
          )}
          {isSearchingError && (
            <Alert
              message={ErrorMessages.SearchingError}
              type='error'
              showIcon
            />
          )}
        </div>
      )}

      <SearchForm
        setProblems={setProblems}
        setIsLoadingWritersError={setIsLoadingWritersError}
        setIsSearchingError={setIsSearchingError}
      />
      <Divider />
      <SearchResult problems={problems} />
    </Flex>
  );
}

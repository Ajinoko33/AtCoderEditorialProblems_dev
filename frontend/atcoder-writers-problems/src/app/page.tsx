'use client';

import { problemsData } from '@/data/mockData';
import type { Problem } from '@/types';
import { Alert, Flex } from 'antd';
import { useCallback, useState } from 'react';
import { SearchForm } from './_components/SearchForm';
import { SearchResult } from './_components/SearchResult';

const ErrorMessages = {
  LoadingWriterError:
    'Failed to loading wirters. Reload this page to try again.',
  SearchingError: 'Failed to searching problems.',
};

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>(problemsData);
  const [hasLoadingWritersError, setHasLoadingWritersError] =
    useState<boolean>(false);
  const [hasSearchingError, setHasSearchingError] = useState<boolean>(false);

  const handleProblemsChange = useCallback((newProblems: Problem[]) => {
    setProblems(newProblems);
  }, []);
  const handleLoadingWritersErrorChange = useCallback((occurred: boolean) => {
    setHasLoadingWritersError(occurred);
  }, []);
  const handleSearchingErrorChange = useCallback((occurred: boolean) => {
    setHasSearchingError(occurred);
  }, []);

  return (
    <Flex align='center' vertical>
      {(hasLoadingWritersError || hasSearchingError) && (
        <div className='mt-4'>
          {hasLoadingWritersError && (
            <Alert
              message={ErrorMessages.LoadingWriterError}
              type='error'
              showIcon
            />
          )}
          {hasSearchingError && (
            <Alert
              message={ErrorMessages.SearchingError}
              type='error'
              showIcon
            />
          )}
        </div>
      )}

      <div className='mt-8'>
        <SearchForm
          handleProblemsChange={handleProblemsChange}
          handleLoadingWritersErrorChange={handleLoadingWritersErrorChange}
          handleSearchingErrorChange={handleSearchingErrorChange}
        />
      </div>
      <div className='mt-2'>
        <SearchResult problems={problems} />
      </div>
    </Flex>
  );
}

'use client';

import { problemsData } from '@/data/Data';
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
  const [isLoadingWritersError, setIsLoadingWritersError] =
    useState<boolean>(false);
  const [isSearchingError, setIsSearchingError] = useState<boolean>(false);

  const handleProblemsChange = useCallback((newProblems: Problem[]) => {
    setProblems(newProblems);
  }, []);

  const handleLoadingWritersErrorChange = useCallback((occurred: boolean) => {
    setIsLoadingWritersError(occurred);
  }, []);

  const handleSearchingErrorChange = useCallback((occurred: boolean) => {
    setIsSearchingError(occurred);
  }, []);

  return (
    <Flex align='center' vertical>
      {(isLoadingWritersError || isSearchingError) && (
        <div className='mt-4'>
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

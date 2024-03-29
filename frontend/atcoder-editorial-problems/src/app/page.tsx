'use client';

import { useTrigger } from '@/hooks';
import type { Problem } from '@/types';
import { Alert, Flex } from 'antd';
import { useCallback, useState } from 'react';
import { SearchForm } from './_components/SearchForm';
import { SearchResult } from './_components/SearchResult';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [hasLoadingWritersError, setHasLoadingWritersError] =
    useState<boolean>(false);
  const [hasSearchingError, setHasSearchingError] = useState<boolean>(false);
  const [retryTrigger, retry] = useTrigger();

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
        <div className='mb-4'>
          {hasLoadingWritersError && (
            <Alert
              message={
                <>
                  Failed to load wirters.{' '}
                  <span
                    className='text-[#1677FF] cursor-pointer hover:text-[#69B1FF] transition-colors duration-300'
                    onClick={retry}
                  >
                    Click here to try again.
                  </span>
                </>
              }
              type='error'
              showIcon
            />
          )}
          {hasSearchingError && (
            <Alert
              message={'Failed to search problems.'}
              type='error'
              showIcon
            />
          )}
        </div>
      )}

      <div className='mt-4'>
        <SearchForm
          handleProblemsChange={handleProblemsChange}
          handleLoadingWritersErrorChange={handleLoadingWritersErrorChange}
          handleSearchingErrorChange={handleSearchingErrorChange}
          retryTrigger={retryTrigger}
        />
      </div>
      <div className='mt-2'>
        <SearchResult problems={problems} />
      </div>
    </Flex>
  );
}

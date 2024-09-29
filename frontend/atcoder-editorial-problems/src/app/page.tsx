'use client';

import { useProblemSearchContext } from '@/contexts';
import { Alert, Flex } from 'antd';
import { SearchForm } from './_components/SearchForm';
import { SearchResult } from './_components/SearchResult';

export default function Home() {
  const { searchConditions, writersHook, problemsHook, search } =
    useProblemSearchContext();

  const hasLoadingWritersError = writersHook?.writersQuery.isError;
  const hasSearchingError = problemsHook?.problemsQuery.isError;

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
                    onClick={() => writersHook.writersQuery.refetch()}
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
          defaultValues={searchConditions}
          writers={writersHook?.writers}
          isLoadingWriters={writersHook?.writersQuery.isLoading}
          search={search}
          isSearching={problemsHook?.problemsQuery.isFetching}
        />
      </div>
      <div className='mt-2'>
        <SearchResult problems={problemsHook.modifiedProblems} />
      </div>
    </Flex>
  );
}

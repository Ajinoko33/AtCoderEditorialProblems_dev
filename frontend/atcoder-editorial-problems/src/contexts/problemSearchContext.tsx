import { GetProblemsParams } from '@/generated/orval/models';
import { useProblems, useWriters } from '@/hooks/api';
import React, { useCallback, useState } from 'react';
import { createCtx } from './createCtx';

type ProblemSearchContext = {
  searchConditions: GetProblemsParams | undefined;
  writersHook: ReturnType<typeof useWriters>;
  problemsHook: ReturnType<typeof useProblems>;
  search: (newSearchConditions: GetProblemsParams) => void;
};

const [useProblemSearchContext, CtxProvider] =
  createCtx<ProblemSearchContext>();

const ProblemSearchContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [searchConditions, setSearchConditions] = useState<
    GetProblemsParams | undefined
  >(undefined);

  const writersHook = useWriters();
  const problemsHook = useProblems(searchConditions);

  const search = useCallback((newSearchConditions: GetProblemsParams) => {
    setSearchConditions(newSearchConditions);
  }, []);

  const contextValue: ProblemSearchContext = {
    searchConditions,
    writersHook,
    problemsHook,
    search,
  };

  return <CtxProvider value={contextValue}>{children}</CtxProvider>;
};

export {
  ProblemSearchContextProvider,
  useProblemSearchContext,
  type ProblemSearchContext,
};

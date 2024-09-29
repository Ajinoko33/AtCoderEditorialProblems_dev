import { clipDifficulty } from '@/components';
import { useGetProblems } from '@/generated/orval/endpoints/problems/problems';
import { GetProblemsParams, Problem } from '@/generated/orval/models';

const modifyProblem = (problem: Problem) => {
  return {
    ...problem,
    difficulty: problem.difficulty && clipDifficulty(problem.difficulty),
  };
};

const modifyProblems = (problems: Problem[]) => {
  return problems.map((problem) => modifyProblem(problem));
};

export const useProblems = (params?: GetProblemsParams) => {
  const problemsQuery = useGetProblems(params, {
    query: {
      enabled: !!params,
      initialData: [],
    },
  });
  const problems = problemsQuery.data;

  const modifiedProblems = problems && modifyProblems(problems);

  return {
    problemsQuery,
    problems,
    modifiedProblems,
  };
};

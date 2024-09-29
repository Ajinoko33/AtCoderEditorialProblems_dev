import { useGetWriters } from '@/generated/orval/endpoints/writers/writers';

export const useWriters = () => {
  const writersQuery = useGetWriters({
    query: {
      initialData: [],
    },
  });
  const writers = writersQuery.data;

  return {
    writersQuery,
    writers,
  };
};

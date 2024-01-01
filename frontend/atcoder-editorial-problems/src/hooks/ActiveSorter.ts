import { SortOrder } from 'antd/es/table/interface';
import { useCallback, useState } from 'react';

export type ActiveSorterHandler<T> = (sorter: T) => void;

export const useActiveSorter = <T>(
  defalutActiveSorter: T,
  defaultOrder: SortOrder,
) => {
  const [activeSorter, setActiveSorter] = useState<T>(defalutActiveSorter);
  const [order, setOrder] = useState<SortOrder>(defaultOrder);

  const activateSorter: ActiveSorterHandler<T> = useCallback(
    (sorter) => {
      setActiveSorter(sorter);
      setOrder((preOrder) => (preOrder === 'descend' ? 'ascend' : 'descend'));
    },
    [setActiveSorter, setOrder],
  );

  return [activeSorter, order, activateSorter] as const;
};

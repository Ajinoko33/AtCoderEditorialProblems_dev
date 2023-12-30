import type { SortOrder } from 'antd/es/table/interface';
import { useMemo, useState } from 'react';

export type SorterHandlers = {
  _switch: () => void;
  disable: () => void;
};

export const useSorter = (defalutValue: SortOrder) => {
  const [sorter, setSorter] = useState<SortOrder>(defalutValue);

  const handlers: SorterHandlers = useMemo(
    () => ({
      _switch: () => {
        // setSorter(preSorOrder === 'ascend' ? 'descend' : 'ascend')とすると，
        // 2回目以降の呼び出しでは値が変更されない．
        setSorter((preSortOrder) =>
          preSortOrder === 'descend' ? 'ascend' : 'descend',
        );
      },
      disable: () => setSorter(null),
    }),
    [],
  );

  return [sorter, handlers] as const;
};

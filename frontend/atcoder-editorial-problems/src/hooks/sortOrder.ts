import type { SortOrder } from 'antd/es/table/interface';
import { useMemo, useState } from 'react';

export type SortOrderHandlers = {
  _switch: () => void;
  disable: () => void;
};

export const useSortOrder = (defalutValue: SortOrder) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>(defalutValue);

  const handlers: SortOrderHandlers = useMemo(
    () => ({
      _switch: () => {
        // setSortOrder(preSortOrder === 'ascend' ? 'descend' : 'ascend')とすると，
        // 2回目以降の呼び出しでは値が変更されない．
        setSortOrder((preSortOrder) =>
          preSortOrder === 'descend' ? 'ascend' : 'descend',
        );
      },
      disable: () => setSortOrder(null),
    }),
    [],
  );

  return [sortOrder, handlers] as const;
};

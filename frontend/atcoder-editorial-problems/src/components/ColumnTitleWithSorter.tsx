import type { SortOrder } from 'antd/es/table/interface';
import type { FC } from 'react';
import { SorterIcon } from './SorterIcon';

export type ColumnTitleWithSorterProps = {
  title: string;
  sortOrder: SortOrder;
  onClick: () => void;
};

export const ColumnTitleWithSorter: FC<ColumnTitleWithSorterProps> = ({
  title,
  sortOrder,
  onClick,
}) => {
  return (
    <div
      className='flex basis-auto cursor-pointer table-column-sorters'
      onClick={onClick}
    >
      <span className='grow shrink font-semibold text-black/[.88]'>
        {title}
      </span>
      <SorterIcon sortOrder={sortOrder} />
    </div>
  );
};

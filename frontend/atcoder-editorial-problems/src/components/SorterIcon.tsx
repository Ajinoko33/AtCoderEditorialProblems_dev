import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import type { SortOrder } from 'antd/es/table/interface';
import type { FC } from 'react';

const baseColor = '#0000004a';
const activeColor = '#1677ff';

export type SortIconProps = {
  sortOrder: SortOrder;
};

const baseStyle = {
  fontSize: '12px',
};

const baseClassName = 'h-[8.5px] transition-colors duration-300';

export const SorterIcon: FC<SortIconProps> = ({ sortOrder }) => {
  const upClassName = `${baseClassName} ${
    sortOrder === 'ascend' ? '' : 'table-column-sorter-inactive'
  }`;
  const downClassName = `${baseClassName} ${
    sortOrder === 'descend' ? '' : 'table-column-sorter-inactive'
  }`;

  const upStyle = {
    ...baseStyle,
    color: sortOrder === 'ascend' ? activeColor : baseColor,
  };
  const downStyle = {
    ...baseStyle,
    color: sortOrder === 'descend' ? activeColor : baseColor,
  };

  return (
    <span className='inline-flex flex-col justify-center cursor-pointer'>
      <CaretUpFilled className={upClassName} style={upStyle} />
      <CaretDownFilled className={downClassName} style={downStyle} />
    </span>
  );
};

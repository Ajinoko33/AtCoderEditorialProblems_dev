import { Problem } from '@/types/Problem';
import { Flex, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FC } from 'react';

export type SearchResultTabChildrenProps = {
  problems: Problem[];
};

interface DataType {
  key: string;
  contest: string;
  title: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Contest',
    dataIndex: 'contest',
    key: 'contest',
    width: 110,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
];

export const SearchResultTabChildren: FC<SearchResultTabChildrenProps> = ({
  problems,
}) => {
  // TODO: diff表示
  // TODO: ユーザーAC状況反映
  // TODO: 非表示レベル(表示レベル)フィルター
  // TODO: diff表示フィルター
  const data: DataType[] = problems.map((problem, idx) => ({
    key: idx.toString(),
    contest: problem.contest,
    title: problem.title,
  }));

  return (
    <Flex vertical>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ['topCenter', 'bottomCenter'] }}
        className='max-w-xl'
      />
    </Flex>
  );
};

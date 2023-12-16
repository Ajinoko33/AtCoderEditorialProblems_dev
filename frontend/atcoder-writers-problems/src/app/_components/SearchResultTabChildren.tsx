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
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
];

export const SearchResultTabChildren: FC<SearchResultTabChildrenProps> = ({
  problems,
}) => {
  // TODO: tableの幅を，内容の長さに依らず固定長に．
  // TODO: diff表示
  // TODO: ユーザーAC状況反映
  // TODO: ACは非表示
  const data: DataType[] = problems.map((problem, idx) => ({
    key: idx.toString(),
    contest: problem.contest,
    title: problem.title,
  }));

  return (
    <Flex align='center' gap='middle' vertical>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ['topCenter', 'bottomCenter'] }}
      />
    </Flex>
  );
};

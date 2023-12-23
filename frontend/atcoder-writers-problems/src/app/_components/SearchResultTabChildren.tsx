import { Problem } from '@/types/Problem';
import { Flex, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import { DifficultyCircle } from './DifficultyCircle';

const DIFF_INF = 100000;

export type SearchResultTabChildrenProps = {
  problems: Problem[];
};

interface DataType {
  key: string;
  id: string;
  contest: string;
  title: string;
  difficulty?: number;
  sortOrder: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Contest',
    dataIndex: 'contest',
    key: 'contest',
    width: 110,
    sorter: (a, b) => {
      if (a.contest > b.contest) return 1;
      else if (a.contest < b.contest) return -1;
      else return a.sortOrder - b.sortOrder;
    },
    sortDirections: ['ascend', 'descend', 'ascend'],
    defaultSortOrder: 'descend',
    showSorterTooltip: false,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    render: (text, record) => (
      <>
        <span className='mr-1'>
          <DifficultyCircle difficulty={record.difficulty} />
        </span>
        <a
          href={`https://atcoder.jp/contests/${record.contest}/tasks/${record.id}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {text}
        </a>
      </>
    ),
  },
  {
    title: 'diff',
    dataIndex: 'difficulty',
    key: 'difficulty',
    width: 80,
    sorter: (a, b) => (a.difficulty || -DIFF_INF) - (b.difficulty || -DIFF_INF),
    sortDirections: ['ascend', 'descend', 'ascend'],
    showSorterTooltip: false,
    render: (text) => text || '-',
  },
];

export const SearchResultTabChildren: FC<SearchResultTabChildrenProps> = ({
  problems,
}) => {
  // TODO: ユーザーAC状況反映
  // TODO: 非表示レベル(表示レベル)フィルター
  // TODO: diff表示フィルター
  const data: DataType[] = problems.map((problem, idx) => ({
    key: idx.toString(),
    id: problem.id,
    contest: problem.contest,
    title: problem.title,
    difficulty: problem.difficulty,
    sortOrder: problem.sortOrder,
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

import type { Problem, ProblemIndex, ResultCode } from '@/types';
import { Flex, Table } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { useMemo, type FC } from 'react';
import { DifficultyCircle } from './DifficultyCircle';
import { TableCustom } from './TableCustom';

const DIFF_INF = 100000;
const problemIndexOrders = {
  A: 10,
  B: 20,
  C: 30,
  D: 40,
  E: 50,
  F: 60,
  F2: 61,
  G: 70,
  H: 80,
  Ex: 81,
};

export type SearchResultTabChildrenProps = {
  problems: Problem[];
  isCustomOpened: boolean;
  handleCustomOpened: (opened: boolean) => void;
  isDifficultyHidden: boolean;
  handleDifficultyHidden: (hidden: boolean) => void;
};

const getProblemIndexOrder = (problemIndex: ProblemIndex) =>
  problemIndexOrders[problemIndex];

interface DataType {
  key: string;
  id: string;
  contest: string;
  name: string;
  difficulty?: number;
  startEpochSecond: number;
  resultCode: ResultCode;
  problemIndex: ProblemIndex;
}

const baseColumns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'contest',
    key: 'ID',
    width: 110,
    sorter: (a, b) =>
      a.startEpochSecond - b.startEpochSecond ||
      getProblemIndexOrder(a.problemIndex) -
        getProblemIndexOrder(b.problemIndex),
    sortDirections: ['ascend', 'descend', 'ascend'],
    defaultSortOrder: 'descend',
    showSorterTooltip: false,
    render: (text, record) => `${record.contest} - ${record.problemIndex}`,
  },
  {
    title: 'Title',
    dataIndex: 'name',
    key: 'Title',
    ellipsis: true,
    // render: 動的に設定
  },
  {
    title: 'diff',
    dataIndex: 'difficulty',
    key: 'diff',
    width: 80,
    sorter: (a, b) => (a.difficulty || -DIFF_INF) - (b.difficulty || -DIFF_INF),
    sortDirections: ['ascend', 'descend', 'ascend'],
    showSorterTooltip: false,
    render: (text) => text || '-',
  },
];

const rowClassName = (record: DataType) => {
  switch (record.resultCode) {
    case 'AC':
      return 'bg-[#C3E6CB]';
    case 'Trying':
      return 'bg-[#FFEEBA]';
    case 'Yet':
      return '';
  }
};

export const SearchResultTabChildren: FC<SearchResultTabChildrenProps> = ({
  problems,
  isCustomOpened,
  handleCustomOpened,
  isDifficultyHidden,
  handleDifficultyHidden,
}) => {
  // TODO: 非表示レベル(表示レベル)フィルター
  // TODO: 表示diff範囲フィルター
  const data: DataType[] = problems.map((problem, idx) => ({
    key: idx.toString(),
    id: problem.id,
    contest: problem.contest,
    name: problem.name,
    difficulty: problem.difficulty,
    startEpochSecond: problem.startEpochSecond,
    resultCode: problem.resultCode,
    problemIndex: problem.problemIndex,
  }));

  const columns = useMemo(
    () =>
      baseColumns
        .filter((column) => column.key !== 'diff' || !isDifficultyHidden)
        .map((column) => {
          // diff非表示設定が有効になっていれば，Titleのdiffサークルを表示しない
          if (column.key === 'Title') {
            const newTitleColumn: ColumnType<DataType> = {
              ...column,
              render: (text, record) => (
                <>
                  {isDifficultyHidden || (
                    <span className='mr-2'>
                      <DifficultyCircle difficulty={record.difficulty} />
                    </span>
                  )}
                  <a
                    href={`https://atcoder.jp/contests/${record.contest}/tasks/${record.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {text}
                  </a>
                </>
              ),
            };
            return newTitleColumn;
          } else {
            return column;
          }
        }),
    [isDifficultyHidden],
  );

  const tableCustom = useMemo(
    () => (
      <TableCustom
        isCustomOpened={isCustomOpened}
        handleCustomOpened={handleCustomOpened}
        isDifficultyHidden={isDifficultyHidden}
        handleDifficultyHidden={handleDifficultyHidden}
      />
    ),
    [isCustomOpened, isDifficultyHidden],
  );

  return (
    <Flex vertical>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ['topCenter', 'bottomCenter'] }}
        className='max-w-xl'
        rowClassName={rowClassName}
        title={() => tableCustom}
      />
    </Flex>
  );
};

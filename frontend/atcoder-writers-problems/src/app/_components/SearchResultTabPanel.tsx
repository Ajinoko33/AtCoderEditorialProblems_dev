import type { Problem, ProblemIndex, ResultCode } from '@/types';
import { Flex, Table } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import type { SortOrder } from 'antd/es/table/interface';
import { useMemo, type FC } from 'react';
import { DifficultyCircle } from './DifficultyCircle';
import {
  MAX_DIFFICULTY_RANGE,
  MIN_DIFFICULTY_RANGE,
  TableCustom,
} from './TableCustom';

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

export type SearchResultTabPanelProps = {
  problems: Problem[];
  isCustomOpened: boolean;
  handleCustomOpenedChange: (opened: boolean) => void;
  isDifficultyHidden: boolean;
  handleDifficultyHiddenChange: (hidden: boolean) => void;
  difficultyRange: [number, number];
  handleDifficultyRangeChange: (newRange: number[]) => void;
  contestIdSortOrder: SortOrder;
  handleContestIdSortOrderChange: (order: SortOrder) => void;
  difficultySortOrder: SortOrder;
  handleDifficultySortOrderChange: (order: SortOrder) => void;
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
    // defaultSortOrder: 動的に設定
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
    // defaultSortOrder: 動的に設定
    showSorterTooltip: false,
    render: (text) => text || '-',
  },
];

const rowClassName: TableProps<DataType>['rowClassName'] = (record) => {
  switch (record.resultCode) {
    case 'AC':
      return 'bg-[#C3E6CB]';
    case 'Trying':
      return 'bg-[#FFEEBA]';
    case 'Yet':
      return '';
  }
};

export const SearchResultTabPanel: FC<SearchResultTabPanelProps> = ({
  problems,
  isCustomOpened,
  handleCustomOpenedChange,
  isDifficultyHidden,
  handleDifficultyHiddenChange,
  difficultyRange,
  handleDifficultyRangeChange,
  contestIdSortOrder,
  handleContestIdSortOrderChange,
  difficultySortOrder,
  handleDifficultySortOrderChange,
}) => {
  const [first, last] = difficultyRange;

  // TODO: ソートstate
  const data: DataType[] = useMemo(
    () =>
      problems
        .filter(({ difficulty }) => {
          if (difficulty === undefined) {
            return (
              first === MIN_DIFFICULTY_RANGE && last === MAX_DIFFICULTY_RANGE
            );
          } else {
            return first <= difficulty && difficulty <= last;
          }
        })
        .map((problem, idx) => ({
          ...problem,
          key: idx.toString(),
        })),
    [problems, difficultyRange],
  );

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

  const columnsWithSortOrder = useMemo(
    () =>
      columns.map((column) => {
        // ソート
        // コンテストIDとdiffのどちらか一方がnull
        if (contestIdSortOrder !== null) {
          if (column.key === 'ID') {
            column.defaultSortOrder = contestIdSortOrder;
          }
        } else if (difficultySortOrder !== null) {
          if (column.key === 'diff') {
            column.defaultSortOrder = difficultySortOrder;
          }
        }
        return column;
      }),
    [columns, contestIdSortOrder, difficultySortOrder],
  );

  const tableCustom = useMemo(
    () => (
      <TableCustom
        isCustomOpened={isCustomOpened}
        handleCustomOpenedChange={handleCustomOpenedChange}
        isDifficultyHidden={isDifficultyHidden}
        handleDifficultyHiddenChange={handleDifficultyHiddenChange}
        difficultyRange={difficultyRange}
        handleDifficultyRangeChange={handleDifficultyRangeChange}
      />
    ),
    [isCustomOpened, isDifficultyHidden, difficultyRange],
  );

  return (
    <Flex vertical>
      <Table
        columns={columnsWithSortOrder}
        dataSource={data}
        pagination={{
          position: [],
          pageSize: 1000,
        }}
        className='max-w-xl'
        rowClassName={rowClassName}
        title={() => tableCustom}
        style={{ minHeight: '100vh' }}
      />
    </Flex>
  );
};

import { ColumnTitleWithSorter } from '@/components/ColumnTitleWithSorter';
import type { UpdateRangeHandler } from '@/hooks/Range';
import type { SortOrderHandlers } from '@/hooks/sortOrder';
import type { Problem, ProblemIndex, ResultCode } from '@/types';
import { Flex, Table } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import type { SortOrder } from 'antd/es/table/interface';
import { useCallback, useMemo, type FC } from 'react';
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
  updateDifficultyRange: UpdateRangeHandler;
  contestIdSortOrder: SortOrder;
  contestIdSortOrderHandlers: SortOrderHandlers;
  difficultySortOrder: SortOrder;
  difficultySortOrderHandlers: SortOrderHandlers;
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
    // title: 'ID', keyより生成
    dataIndex: 'contest',
    key: 'ID',
    width: 110,
    sorter: (a, b) =>
      a.startEpochSecond - b.startEpochSecond ||
      getProblemIndexOrder(a.problemIndex) -
        getProblemIndexOrder(b.problemIndex),
    sortDirections: [],
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
    // title: 'diff', keyより生成
    dataIndex: 'difficulty',
    key: 'diff',
    width: 80,
    sorter: (a, b) => (a.difficulty || -DIFF_INF) - (b.difficulty || -DIFF_INF),
    sortDirections: [],
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
  updateDifficultyRange,
  contestIdSortOrder,
  contestIdSortOrderHandlers,
  difficultySortOrder,
  difficultySortOrderHandlers,
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

  const onClickContestIdSorter = useCallback(() => {
    contestIdSortOrderHandlers._switch();
    difficultySortOrderHandlers.disable();
  }, []);
  const onClickDifficultySorter = useCallback(() => {
    difficultySortOrderHandlers._switch();
    contestIdSortOrderHandlers.disable();
  }, []);

  const columnsWithSortOrder = useMemo(
    () =>
      columns
        .map((column) => {
          // ソート
          // コンテストIDとdiffのどちらか一方がnull
          if (contestIdSortOrder !== null) {
            if (column.key === 'ID') {
              return {
                ...column,
                sortOrder: contestIdSortOrder,
              };
            }
          } else if (difficultySortOrder !== null) {
            if (column.key === 'diff') {
              return {
                ...column,
                sortOrder: difficultySortOrder,
              };
            }
          }
          return column;
        })
        .map((column) => {
          // タイトルの表示を同期
          switch (column.key) {
            case 'ID':
              return {
                ...column,
                title: (
                  <ColumnTitleWithSorter
                    title={column.key}
                    sortOrder={contestIdSortOrder}
                    onClick={onClickContestIdSorter}
                  />
                ),
              };
            case 'diff':
              return {
                ...column,
                title: (
                  <ColumnTitleWithSorter
                    title={column.key}
                    sortOrder={difficultySortOrder}
                    onClick={onClickDifficultySorter}
                  />
                ),
              };
            default:
              return column;
          }
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
        updateDifficultyRange={updateDifficultyRange}
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

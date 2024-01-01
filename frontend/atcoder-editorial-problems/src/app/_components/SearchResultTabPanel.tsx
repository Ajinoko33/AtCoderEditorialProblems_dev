import { ColumnTitleWithSorter, LinkToOutside } from '@/components';
import type { ActiveSorterHandler, UpdateRangeHandler } from '@/hooks';
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

export type sortableColumn = 'ID' | 'diff';
export type SearchResultTabPanelProps = {
  problems: Problem[];
  isCustomOpened: boolean;
  handleCustomOpenedChange: (opened: boolean) => void;
  isDifficultyHidden: boolean;
  handleDifficultyHiddenChange: (hidden: boolean) => void;
  difficultyRange: [number, number];
  updateDifficultyRange: UpdateRangeHandler;
  activeSorter: sortableColumn;
  sortOrder: SortOrder;
  activateSorter: ActiveSorterHandler<sortableColumn>;
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
  order: number;
}

const baseColumns: ColumnsType<DataType> = [
  {
    // title: 'ID', keyより生成
    dataIndex: 'contest',
    key: 'ID',
    width: 110,
    sortDirections: [],
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.order - b.order, // ソート済みのものをorderに従って表示
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

const sort = (
  data: DataType[],
  activeSorter: sortableColumn,
  sortOrder: SortOrder,
) => {
  let res = data;
  switch (activeSorter) {
    case 'ID':
      res.sort(
        (a, b) =>
          a.startEpochSecond - b.startEpochSecond ||
          getProblemIndexOrder(a.problemIndex) -
            getProblemIndexOrder(b.problemIndex),
      );
      break;
    case 'diff':
      res.sort(
        (a, b) => (a.difficulty || -DIFF_INF) - (b.difficulty || -DIFF_INF),
      );
      break;
  }
  if (sortOrder === 'descend') {
    res.reverse();
  }

  return res.map((datum, idx) => ({
    ...datum,
    order: idx,
  }));
};

const filterByDifficulty = (
  data: DataType[],
  difficultyRange: [number, number],
) => {
  const [first, last] = difficultyRange;
  return data.filter(({ difficulty }) => {
    if (difficulty === undefined) {
      return first === MIN_DIFFICULTY_RANGE && last === MAX_DIFFICULTY_RANGE;
    } else {
      return first <= difficulty && difficulty <= last;
    }
  });
};

export const SearchResultTabPanel: FC<SearchResultTabPanelProps> = ({
  problems,
  isCustomOpened,
  handleCustomOpenedChange,
  isDifficultyHidden,
  handleDifficultyHiddenChange,
  difficultyRange,
  updateDifficultyRange,
  activeSorter,
  sortOrder,
  activateSorter,
}) => {
  const data: DataType[] = useMemo(
    () =>
      problems.map((problem, idx) => ({
        ...problem,
        key: idx.toString(),
        order: idx, // ソート時に変更
      })),
    [problems],
  );

  // ソート
  // diff非表示時はdiff列が表示されず表のsorterが使えないので、
  // 内部で順序づけしておいたものを表示する
  const sortedData = useMemo(
    () => sort(data, activeSorter, sortOrder),
    [data, activeSorter, sortOrder],
  );

  // 表示する問題を絞り込む
  const fileterdSortedData: DataType[] = useMemo(
    () => filterByDifficulty(sortedData, difficultyRange),
    [sortedData, difficultyRange],
  );

  // diff表示/非表示設定をテーブルに反映
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
                  <LinkToOutside
                    href={`https://atcoder.jp/contests/${record.contest}/tasks/${record.id}`}
                    iconSize='none'
                  >
                    {text}
                  </LinkToOutside>
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

  const onClickContestIdSorter = useCallback(
    () => activateSorter('ID'),
    [activateSorter],
  );

  const onClickDifficultySorter = useCallback(
    () => activateSorter('diff'),
    [activateSorter],
  );

  // 列タイトルの表示をソート状態と同期
  const columnsWithSortOrder = useMemo(
    () =>
      columns.map((column) => {
        switch (column.key) {
          case 'ID':
            return {
              ...column,
              title: (
                <ColumnTitleWithSorter
                  title={column.key}
                  sortOrder={activeSorter === 'ID' ? sortOrder : null}
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
                  sortOrder={activeSorter === 'diff' ? sortOrder : null}
                  onClick={onClickDifficultySorter}
                />
              ),
            };
          default:
            return column;
        }
      }),
    [
      columns,
      activeSorter,
      sortOrder,
      onClickContestIdSorter,
      onClickDifficultySorter,
    ],
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
    [
      isCustomOpened,
      isDifficultyHidden,
      difficultyRange,
      handleCustomOpenedChange,
      handleDifficultyHiddenChange,
      updateDifficultyRange,
    ],
  );

  return (
    <Flex vertical>
      <Table
        columns={columnsWithSortOrder}
        dataSource={fileterdSortedData}
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

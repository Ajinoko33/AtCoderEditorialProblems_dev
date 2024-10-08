import { Problem } from '@/generated/orval/models';
import { useActiveSorter, useRange } from '@/hooks';
import { categories } from '@/types';
import { Tabs, type TabsProps } from 'antd';
import { memo, useCallback, useState, type FC } from 'react';
import { SearchResultTabPanel, SortableColumn } from './SearchResultTabPanel';
import { MAX_DIFFICULTY_RANGE, MIN_DIFFICULTY_RANGE } from './TableCustom';

export type SearchResultProps = {
  problems: Problem[];
};

export const SearchResult: FC<SearchResultProps> = memo((props) => {
  const { problems } = props;
  const [isCustomOpened, setIsCustomOpened] = useState<boolean>(false);
  const [isDifficultyHidden, setIsDifficultyHidden] = useState<boolean>(false);
  const [difficultyRange, updateDifficultyRange] = useRange([
    MIN_DIFFICULTY_RANGE,
    MAX_DIFFICULTY_RANGE,
  ]);
  const [activeSorter, sortOrder, activateSorter] =
    useActiveSorter<SortableColumn>('ID', 'descend');

  const handleCustomOpenedChange = useCallback((opened: boolean) => {
    setIsCustomOpened(opened);
  }, []);
  const handleDifficultyHiddenChange = useCallback((hidden: boolean) => {
    setIsDifficultyHidden(hidden);
  }, []);

  // カテゴリごとにTab生成
  const items: TabsProps['items'] = categories.map((category) => {
    const problemsInCategory = problems.filter(
      (problem) => problem.category === category,
    );
    return {
      label: (
        <span className='mx-2'>
          {category} (
          <span className='mx-0.5'>{problemsInCategory.length}</span>)
        </span>
      ),
      key: category,
      children: (
        <SearchResultTabPanel
          key={category}
          problems={problemsInCategory}
          isCustomOpened={isCustomOpened}
          handleCustomOpenedChange={handleCustomOpenedChange}
          isDifficultyHidden={isDifficultyHidden}
          handleDifficultyHiddenChange={handleDifficultyHiddenChange}
          difficultyRange={difficultyRange}
          updateDifficultyRange={updateDifficultyRange}
          activeSorter={activeSorter}
          sortOrder={sortOrder}
          activateSorter={activateSorter}
        />
      ),
    };
  });

  return <Tabs items={items} tabBarGutter={18} size='middle' centered />;
});

SearchResult.displayName = 'SearchResult';

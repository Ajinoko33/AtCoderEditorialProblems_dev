import { categories, type Problem } from '@/types';
import { Tabs, type TabsProps } from 'antd';
import { memo, useCallback, useState, type FC } from 'react';
import { SearchResultTabPanel } from './SearchResultTabPanel';

export type SearchResultProps = {
  problems: Problem[];
};

export const SearchResult: FC<SearchResultProps> = memo(({ problems }) => {
  const [isCustomOpened, setIsCustomOpened] = useState<boolean>(false);
  const [isDifficultyHidden, setIsDifficultyHidden] = useState<boolean>(false);

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
          problems={problemsInCategory}
          isCustomOpened={isCustomOpened}
          handleCustomOpenedChange={handleCustomOpenedChange}
          isDifficultyHidden={isDifficultyHidden}
          handleDifficultyHiddenChange={handleDifficultyHiddenChange}
        />
      ),
    };
  });

  return <Tabs items={items} tabBarGutter={18} size='middle' centered />;
});

import { categories, type Problem } from '@/types';
import { Tabs } from 'antd';
import { memo, useCallback, useState, type FC } from 'react';
import { SearchResultTabChildren } from './SearchResultTabChildren';

export type SearchResultProps = {
  problems: Problem[];
};

export const SearchResult: FC<SearchResultProps> = memo(({ problems }) => {
  const [isCustomOpened, setIsCustomOpened] = useState<boolean>(false);
  const [isDifficultyHidden, setIsDifficultyHidden] = useState<boolean>(false);

  const handleCustomOpened = useCallback((opened: boolean) => {
    setIsCustomOpened(opened);
  }, []);
  const handleDifficultyHidden = useCallback((hidden: boolean) => {
    setIsDifficultyHidden(hidden);
  }, []);

  // カテゴリごとにTab生成
  const items = categories.map((category) => {
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
        <SearchResultTabChildren
          problems={problemsInCategory}
          isCustomOpened={isCustomOpened}
          handleCustomOpened={handleCustomOpened}
          isDifficultyHidden={isDifficultyHidden}
          handleDifficultyHidden={handleDifficultyHidden}
        />
      ),
    };
  });

  return <Tabs items={items} tabBarGutter={18} size='middle' centered />;
});

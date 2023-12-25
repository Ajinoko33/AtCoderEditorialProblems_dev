import { categories, type Problem } from '@/types';
import { Tabs } from 'antd';
import { memo, type FC } from 'react';
import { SearchResultTabChildren } from './SearchResultTabChildren';

export type SearchResultProps = {
  problems: Problem[];
};

export const SearchResult: FC<SearchResultProps> = memo(({ problems }) => {
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
      children: <SearchResultTabChildren problems={problemsInCategory} />,
    };
  });

  return <Tabs items={items} tabBarGutter={18} size='middle' centered />;
});

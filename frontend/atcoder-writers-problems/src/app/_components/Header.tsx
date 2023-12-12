'use client';

import { HeaderArea } from '@/components/HeaderArea';
import { HeaderMenuItem } from '@/components/HeaderMenuItem';
import {
  HeaderMenuLinks,
  HeaderMenuLinkType,
} from '@/components/HeaderMenuLinks';
import { QuestionOutlineIcon, SearchIcon } from '@chakra-ui/icons';

const headerMenuSelectItems: HeaderMenuLinkType[] = [
  { label: 'AtCoder', url: 'https://atcoder.jp/', isExternal: true },
  {
    label: '@Ajinoko33',
    url: 'https://twitter.com/Ajinoko33',
    isExternal: true,
  },
];

export const Header = () => {
  return (
    <HeaderArea title="AtCoder Writer's Problems">
      <HeaderMenuItem label='問題検索' url='/' icon={<SearchIcon />} />
      <HeaderMenuItem
        label='使い方'
        url='/howtouse'
        icon={<QuestionOutlineIcon />}
      />
      <HeaderMenuLinks label='リンク' items={headerMenuSelectItems} />
    </HeaderArea>
  );
};

import { LinkToOutside } from '@/components';
import {
  FileSearchOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Menu, type MenuProps } from 'antd';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useState } from 'react';

const items: MenuProps['items'] = [
  {
    label: <Link href='/'>問題検索</Link>,
    key: 'top',
    icon: <FileSearchOutlined />,
  },
  {
    label: <Link href='/help'>ヘルプ</Link>,
    key: 'help',
    icon: <QuestionCircleOutlined />,
  },
  {
    label: 'リンク',
    key: 'links',
    icon: <LinkOutlined />,
    children: [
      {
        label: (
          <LinkToOutside href='https://atcoder.jp/'>AtCoder</LinkToOutside>
        ),
        key: 'atcoder',
      },
      {
        label: (
          <LinkToOutside href='https://twitter.com/Ajinoko33'>
            @Ajinoko33
          </LinkToOutside>
        ),
        key: 'twitter',
      },
    ],
  },
];

export const HeaderMenu = () => {
  const defaultSelectedKey = useSelectedLayoutSegment() ?? 'top';

  const [selectedKey, setSelectedKey] = useState(defaultSelectedKey);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setSelectedKey(key);
  };

  return (
    <Menu
      mode='horizontal'
      items={items}
      selectedKeys={[selectedKey]}
      onClick={onClick}
      className='bg-transparent border-0'
    />
  );
};

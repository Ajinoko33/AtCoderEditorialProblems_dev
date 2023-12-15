import {
  ExportOutlined,
  FileSearchOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Space } from 'antd';
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
    label: <Link href='/howToUse'>使い方</Link>,
    key: 'howToUse',
    icon: <QuestionCircleOutlined />,
  },
  {
    label: 'リンク',
    key: 'links',
    icon: <LinkOutlined />,
    children: [
      {
        label: (
          <Space>
            <a
              href='https://atcoder.jp/'
              target='_blank'
              rel='noopener noreferrer'
            >
              AtCoder
            </a>
            <ExportOutlined style={{ color: '#4B5563' }} />
          </Space>
        ),
        key: 'atcoder',
      },
      {
        label: (
          <Space>
            <a
              href='https://twitter.com/Ajinoko33'
              target='_blank'
              rel='noopener noreferrer'
            >
              @Ajinoko33
            </a>
            <ExportOutlined style={{ color: '#4B5563' }} />
          </Space>
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
      className='float-right bg-transparent border-0'
    />
  );
};

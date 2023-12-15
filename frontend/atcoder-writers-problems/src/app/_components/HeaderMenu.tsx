import {
  ExportOutlined,
  FileSearchOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Space } from 'antd';

const items: MenuProps['items'] = [
  {
    label: '問題検索',
    key: 'top',
    icon: <FileSearchOutlined />,
  },
  {
    label: '使い方',
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
  return (
    <Menu
      mode='horizontal'
      items={items}
      className='float-right bg-transparent border-0'
    />
  );
};

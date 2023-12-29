import { ExportOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import type { FC, ReactNode } from 'react';

export type LinkToOutsideProps = {
  href: string;
  iconSize?: 'normal' | 'small' | 'none';
  children: ReactNode;
};

export const LinkToOutside: FC<LinkToOutsideProps> = ({
  href,
  iconSize = 'normal',
  children,
}) => {
  return (
    <Space>
      <a href={href} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
      {iconSize !== 'none' && (
        <ExportOutlined
          style={{
            color: '#4B5563',
            fontSize: iconSize === 'small' ? '12px' : undefined,
          }}
        />
      )}
    </Space>
  );
};

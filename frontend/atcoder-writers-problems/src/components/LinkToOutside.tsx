import { ExportOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import type { FC } from 'react';

export type LinkToOutsideProps = {
  text: string;
  href: string;
  iconSize?: 'normal' | 'small' | 'none';
};

export const LinkToOutside: FC<LinkToOutsideProps> = ({
  text,
  href,
  iconSize = 'normal',
}) => {
  return (
    <Space>
      <a href={href} target='_blank' rel='noopener noreferrer'>
        {text}
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

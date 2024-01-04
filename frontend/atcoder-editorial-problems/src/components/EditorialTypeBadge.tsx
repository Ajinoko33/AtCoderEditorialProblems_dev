import type { EditorialType } from '@/types';
import { Badge } from 'antd';
import type { FC } from 'react';

export type EditorialTypeBadgeProps = {
  editorialType: EditorialType;
};

const badgeStyles = {
  official: {
    count: 'official',
    color: '#bfbfbf',
  },
  user: {
    count: 'user',
    color: '#ffc069',
  },
};

export const EditorialTypeBadge: FC<EditorialTypeBadgeProps> = ({
  editorialType,
}) => {
  const badgeStyle = badgeStyles[editorialType];

  return (
    <Badge
      count={badgeStyle.count}
      color={badgeStyle.color}
      size='small'
      style={{ boxShadow: 'none' }}
    />
  );
};

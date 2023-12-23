import {
  TopcoderLikeCircle,
  getRatingColor,
} from '@/components/external/AtCoderProblems';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';
import { FC } from 'react';

export type DifficultyCircleProps = {
  difficulty?: number;
};

const getColor = (difficulty: number) => {
  if (difficulty < 3200) {
    return getRatingColor(difficulty);
  } else if (difficulty < 3600) {
    return 'Bronze';
  } else if (difficulty < 4000) {
    return 'Silver';
  } else {
    return 'Gold';
  }
};

export const DifficultyCircle: FC<DifficultyCircleProps> = ({ difficulty }) => {
  if (difficulty === undefined) {
    return (
      <span>
        <Tooltip title='Difficulty is unavailable.'>
          <Badge
            size='small'
            count={<QuestionCircleFilled className='text-cyan-400' />}
          />
        </Tooltip>
      </span>
    );
  }

  const color = getColor(difficulty);

  return (
    <span>
      <Tooltip title={`Difficulty: ${difficulty}`}>
        <span>
          <TopcoderLikeCircle color={color} rating={difficulty} />
        </span>
      </Tooltip>
    </span>
  );
};

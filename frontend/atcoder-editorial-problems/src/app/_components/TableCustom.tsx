import type { RatingColor, RatingMetalColor } from '@/components';
import type { Range, UpdateRangeHandler } from '@/hooks';
import { SettingOutlined } from '@ant-design/icons';
import {
  Collapse,
  Form,
  Slider,
  Switch,
  type CollapseProps,
  type SwitchProps,
} from 'antd';
import { useMemo, type FC } from 'react';

export const MIN_DIFFICULTY_RANGE = 0;
export const MAX_DIFFICULTY_RANGE = 4400;
type AllRatingColor = RatingColor | RatingMetalColor;
type UpperDifficultyLimit = {
  [key in AllRatingColor]: number;
};
const UPPER_DIFFICULTY_LIMIT: UpperDifficultyLimit = {
  Black: 0,
  Grey: 400,
  Brown: 800,
  Green: 1200,
  Cyan: 1600,
  Blue: 2000,
  Yellow: 2400,
  Orange: 2800,
  Red: 3200,
  Bronze: 3600,
  Silver: 4000,
  Gold: 4400,
};

export type TableCustomProps = {
  isCustomOpened: boolean;
  handleCustomOpenedChange: (opened: boolean) => void;
  isDifficultyHidden: boolean;
  handleDifficultyHiddenChange: (hidden: boolean) => void;
  difficultyRange: Range;
  updateDifficultyRange: UpdateRangeHandler;
};

const calcColorPercentage = (color: AllRatingColor, range: Range) => {
  const value = UPPER_DIFFICULTY_LIMIT[color];
  const first = range[0];
  const last = range[1];
  const length = last - first;
  if (length === 0) return 0;
  else return Math.max(0, Math.min(100, ((value - first) / length) * 100));
};

const getStyleColorPercentage = (color: AllRatingColor, range: Range) => {
  switch (color) {
    case 'Grey':
      return `${calcColorPercentage('Grey', range)}%`;
    case 'Brown':
      return `${calcColorPercentage('Grey', range)}% ${calcColorPercentage(
        'Brown',
        range,
      )}%`;
    case 'Green':
      return `${calcColorPercentage('Brown', range)}% ${calcColorPercentage(
        'Green',
        range,
      )}%`;
    case 'Cyan':
      return `${calcColorPercentage('Green', range)}% ${calcColorPercentage(
        'Cyan',
        range,
      )}%`;
    case 'Blue':
      return `${calcColorPercentage('Cyan', range)}% ${calcColorPercentage(
        'Blue',
        range,
      )}%`;
    case 'Yellow':
      return `${calcColorPercentage('Blue', range)}% ${calcColorPercentage(
        'Yellow',
        range,
      )}%`;
    case 'Orange':
      return `${calcColorPercentage('Yellow', range)}% ${calcColorPercentage(
        'Orange',
        range,
      )}%`;
    case 'Red':
      return `${calcColorPercentage('Orange', range)}% ${calcColorPercentage(
        'Red',
        range,
      )}%`;
    case 'Bronze':
      return `${calcColorPercentage('Red', range)}%`;
    case 'Silver':
      return `${calcColorPercentage('Bronze', range)}%`;
    case 'Gold':
      return `${calcColorPercentage('Silver', range)}%`;
  }
};

const getTrackBg = (range: Range) => {
  return `linear-gradient(to right, #808080 ${getStyleColorPercentage(
    'Grey',
    range,
  )}, #804000 ${getStyleColorPercentage(
    'Brown',
    range,
  )}, #008000 ${getStyleColorPercentage(
    'Green',
    range,
  )}, #00C0C0 ${getStyleColorPercentage(
    'Cyan',
    range,
  )}, #0000FF ${getStyleColorPercentage(
    'Blue',
    range,
  )}, #C0C000 ${getStyleColorPercentage(
    'Yellow',
    range,
  )}, #FF8000 ${getStyleColorPercentage(
    'Orange',
    range,
  )}, #FF0000 ${getStyleColorPercentage(
    'Red',
    range,
  )}, #965C2C ${getStyleColorPercentage(
    'Bronze',
    range,
  )}, #FFDABD, #965C2C ${getStyleColorPercentage(
    'Silver',
    range,
  )}, #808080 ${getStyleColorPercentage(
    'Silver',
    range,
  )}, #FFFFFF, #808080 ${getStyleColorPercentage(
    'Gold',
    range,
  )}, #FFD700 ${getStyleColorPercentage(
    'Gold',
    range,
  )}, #FFFFFF, #FFD700 100.000%)`;
};

export const TableCustom: FC<TableCustomProps> = ({
  isCustomOpened,
  handleCustomOpenedChange,
  isDifficultyHidden,
  handleDifficultyHiddenChange,
  difficultyRange,
  updateDifficultyRange,
}) => {
  const onChangeCollapse: CollapseProps['onChange'] = (key) => {
    handleCustomOpenedChange(key.includes('1'));
  };
  const onChangeHideDifficulty: SwitchProps['onClick'] = (checked) => {
    handleDifficultyHiddenChange(checked);
  };

  const sliderStyle = useMemo(
    () => ({
      track: {
        // 間の色
        background: getTrackBg(difficultyRange),
      },
      rail: {
        // レールの色
        background:
          'linear-gradient(to right, #808080 9.091%, #804000 9.091% 18.182%, #008000 18.182% 27.273%, #00C0C0 27.273% 36.364%, #0000FF 36.364% 45.455%, #C0C000 45.455% 54.545%, #FF8000 54.545% 63.636%, #FF0000 63.636% 71.111%, #965C2C 72.727%, #FFDABD, #965C2C 81.818%, #808080 81.818%, #FFFFFF, #808080 90.909%, #FFD700 90.909%, #FFFFFF, #FFD700 100.000%)',
        opacity: 0.3,
      },
    }),
    [difficultyRange],
  );

  const items = [
    {
      key: '1',
      label: (
        <>
          <span className='mr-1'>
            <SettingOutlined />
          </span>
          Customize
        </>
      ),
      children: (
        <Form>
          <Form.Item className='mb-0' label='Hide Difficulty'>
            <Switch
              checked={isDifficultyHidden}
              onClick={onChangeHideDifficulty}
            />
          </Form.Item>
          <Form.Item className='mb-0' label='Filter Difficulty'>
            <Slider
              range
              onChange={updateDifficultyRange}
              min={MIN_DIFFICULTY_RANGE}
              max={MAX_DIFFICULTY_RANGE}
              value={[difficultyRange[0], difficultyRange[1]]}
              styles={sliderStyle}
            />
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Collapse
      items={items}
      activeKey={isCustomOpened ? '1' : undefined}
      onChange={onChangeCollapse}
    />
  );
};

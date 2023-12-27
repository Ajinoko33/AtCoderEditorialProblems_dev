import { SettingOutlined } from '@ant-design/icons';
import {
  Collapse,
  Form,
  Slider,
  Switch,
  type CollapseProps,
  type SwitchProps,
} from 'antd';
import type { SliderRangeProps } from 'antd/es/slider';
import type { FC } from 'react';

export const MIN_DIFFICULTY_RANGE = 0;
export const MAX_DIFFICULTY_RANGE = 4500;

export type TableCustomProps = {
  isCustomOpened: boolean;
  handleCustomOpenedChange: (opened: boolean) => void;
  isDifficultyHidden: boolean;
  handleDifficultyHiddenChange: (hidden: boolean) => void;
  difficultyRange: [number, number];
  handleDifficultyRangeChange: (newRange: number[]) => void;
};

export const TableCustom: FC<TableCustomProps> = ({
  isCustomOpened,
  handleCustomOpenedChange,
  isDifficultyHidden,
  handleDifficultyHiddenChange,
  difficultyRange,
  handleDifficultyRangeChange,
}) => {
  const onChangeCollapse: CollapseProps['onChange'] = (key) => {
    handleCustomOpenedChange(key.includes('1'));
  };
  const onChangeHideDifficulty: SwitchProps['onClick'] = (checked) => {
    handleDifficultyHiddenChange(checked);
  };
  const onChangeDifficultyRange: SliderRangeProps['onChangeComplete'] = (
    value: number[],
  ) => {
    handleDifficultyRangeChange(value);
  };

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
              onChange={onChangeDifficultyRange}
              min={MIN_DIFFICULTY_RANGE}
              max={MAX_DIFFICULTY_RANGE}
              value={[difficultyRange[0], difficultyRange[1]]}
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

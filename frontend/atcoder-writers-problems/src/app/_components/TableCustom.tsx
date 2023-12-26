import { SettingOutlined } from '@ant-design/icons';
import {
  Collapse,
  Form,
  Slider,
  Switch,
  type CollapseProps,
  type SwitchProps,
} from 'antd';
import { type FC } from 'react';

export type TableCustomProps = {
  isCustomOpened: boolean;
  handleCustomOpenedChange: (opened: boolean) => void;
  isDifficultyHidden: boolean;
  handleDifficultyHiddenChange: (hidden: boolean) => void;
};

export const TableCustom: FC<TableCustomProps> = ({
  isCustomOpened,
  handleCustomOpenedChange,
  isDifficultyHidden,
  handleDifficultyHiddenChange,
}) => {
  const onChangeCollapse: CollapseProps['onChange'] = (key) => {
    handleCustomOpenedChange(key.includes('1'));
  };
  const onChangeHideDifficulty: SwitchProps['onClick'] = (checked) => {
    handleDifficultyHiddenChange(checked);
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
            <Slider range defaultValue={[20, 50]} />
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

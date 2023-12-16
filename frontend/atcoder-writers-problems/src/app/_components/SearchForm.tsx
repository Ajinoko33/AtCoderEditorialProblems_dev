import { writersDataOptions } from '@/data/Data';
import { Problem } from '@/types/Problem';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import { FC } from 'react';

export type SearchFormProps = {
  setProblems: (problems: Problem[]) => void;
};

type FieldType = {
  writer: string;
  user?: string;
};

// TODO:バリデーション
// TODO:データ取得

export const SearchForm: FC<SearchFormProps> = ({ setProblems }) => {
  return (
    <Form labelCol={{ span: 8 }}>
      <Form.Item<FieldType>
        label='Writer'
        name='writer'
        rules={[{ required: true }]}
      >
        <Select
          showSearch
          placeholder='Search to Select'
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={writersDataOptions}
        />
      </Form.Item>
      <Form.Item<FieldType> label='User ID' name='user'>
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

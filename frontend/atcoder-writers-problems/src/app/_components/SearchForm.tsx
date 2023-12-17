import { axiosInstance } from '@/config/axios';
import { Problem } from '@/types/Problem';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

export type SearchFormProps = {
  setProblems: Dispatch<SetStateAction<Problem[]>>;
};

type FieldType = {
  writer: string;
  user?: string;
};

// TODO:バリデーション
// TODO:問題データ取得

export const SearchForm: FC<SearchFormProps> = ({ setProblems }) => {
  const [writers, setWriters] = useState<String[]>([]);

  const createOptions = (_wirters: String[]) =>
    _wirters.map((_writer) => ({
      value: _writer,
      label: _writer,
    }));

  // Writer全件取得
  useEffect(() => {
    axiosInstance
      .get('/writers')
      .then((res) => {
        console.log(res.data);
        setWriters(res.data);
      })
      .catch((error) => {
        console.log('GET error when getting writers!!');
      });
  }, []);

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
          options={createOptions(writers)}
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

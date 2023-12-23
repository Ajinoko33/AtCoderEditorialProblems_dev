import { clipDifficulty } from '@/components/external/AtCoderProblems';
import { axiosInstance } from '@/config/axios';
import {
  Problem,
  ProblemResponse,
  createProblemFromProblemResponse,
} from '@/types/Problem';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import { AxiosResponse } from 'axios';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

export type SearchFormProps = {
  setProblems: Dispatch<SetStateAction<Problem[]>>;
};

type FieldType = {
  writer: string;
  user?: string;
};

//TODO:writer取得中の状態表示
//TODO:問題取得中の状態表示

export const SearchForm: FC<SearchFormProps> = ({ setProblems }) => {
  const [writers, setWriters] = useState<String[]>([]);

  const validateMessages = {
    required: "'${label}' is required!",
  };

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
        setWriters(res.data);
      })
      .catch((error) => {
        console.log('GET error when getting writers!!');
      });
  }, []);

  // submit
  const onFinish = (values: FieldType) => {
    axiosInstance
      .get('/search', {
        params: {
          writer: values.writer,
          user: values.user || undefined,
        },
      })
      .then((res: AxiosResponse<ProblemResponse[]>) => {
        // difficultyを丸める
        const difficultyClippedProblems = res.data.map((problem) => ({
          ...createProblemFromProblemResponse(problem),
          difficulty: problem.difficulty && clipDifficulty(problem.difficulty),
        }));

        setProblems(difficultyClippedProblems);
      })
      .catch((error) => {
        console.log('POST error when getting problems!!');
      });
  };

  return (
    <Form
      validateMessages={validateMessages}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
    >
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

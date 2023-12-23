import { clipDifficulty } from '@/components/external/AtCoderProblems';
import { axiosInstance } from '@/config/axios';
import {
  Problem,
  ProblemResponse,
  createProblemFromProblemResponse,
} from '@/types/Problem';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
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

type CallSatus = 'Loading' | 'Success' | 'Failure';

//TODO:問題取得中の状態表示

export const SearchForm: FC<SearchFormProps> = ({ setProblems }) => {
  const [writers, setWriters] = useState<String[]>([]);
  const [callStatus, setCallStatus] = useState<CallSatus>('Loading');

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
        setCallStatus('Success');
        setWriters(res.data);
      })
      .catch((error) => {
        setCallStatus('Failure');
        console.log('Error when getting writers!!');
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
      className='w-72'
      validateMessages={validateMessages}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
    >
      <Form.Item<FieldType>
        label='Writer'
        name='writer'
        rules={[{ required: true }]}
        hasFeedback={callStatus === 'Failure'}
        validateStatus={callStatus === 'Failure' ? 'warning' : undefined}
        help={
          callStatus === 'Failure' ? (
            <>
              Failed to Loading wirters. <br />
              Reload this page to try again.
            </>
          ) : undefined
        }
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
          suffixIcon={
            callStatus === 'Loading' ? (
              <LoadingOutlined style={{ pointerEvents: 'none' }} />
            ) : undefined
          }
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

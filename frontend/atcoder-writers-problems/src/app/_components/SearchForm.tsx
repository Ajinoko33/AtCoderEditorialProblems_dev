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
import { Dispatch, FC, SetStateAction, memo, useEffect, useState } from 'react';

export type SearchFormProps = {
  setProblems: Dispatch<SetStateAction<Problem[]>>;
};

type FieldType = {
  writer: string;
  user?: string;
};

type LoadStatus = 'Ready' | 'Loading' | 'Success' | 'Failure';

export const SearchForm: FC<SearchFormProps> = memo(({ setProblems }) => {
  const [writers, setWriters] = useState<string[]>([]);
  const [loadWritersStatus, setLoadWritersStatus] =
    useState<LoadStatus>('Ready');
  const [searchStatus, setSearchStatus] = useState<LoadStatus>('Ready');

  const validateMessages = {
    required: "'${label}' is required!",
  };

  const createOptions = (_wirters: string[]) =>
    _wirters.map((_writer) => ({
      value: _writer,
      label: _writer,
    }));

  // Writer全件取得
  useEffect(() => {
    setLoadWritersStatus('Loading');
    axiosInstance
      .get('/writers')
      .then((res) => {
        setLoadWritersStatus('Success');
        setWriters(res.data);
      })
      .catch((error) => {
        setLoadWritersStatus('Failure');
        console.log('ERROR when getting writers!!');
        console.log(error);
      });
  }, []);

  // submit
  const onFinish = (values: FieldType) => {
    setSearchStatus('Loading');
    axiosInstance
      .get('/search', {
        params: {
          writer: values.writer,
          user: values.user || undefined,
        },
      })
      .then((res: AxiosResponse<ProblemResponse[]>) => {
        setSearchStatus('Success');

        // difficultyを丸める
        const difficultyClippedProblems = res.data.map((problem) => ({
          ...createProblemFromProblemResponse(problem),
          difficulty: problem.difficulty && clipDifficulty(problem.difficulty),
        }));

        setProblems(difficultyClippedProblems);
      })
      .catch((error) => {
        setSearchStatus('Failure');
        console.log('ERROR when getting problems!!');
        console.log(error);
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
        hasFeedback={loadWritersStatus === 'Failure'}
        validateStatus={loadWritersStatus === 'Failure' ? 'warning' : undefined}
        help={
          loadWritersStatus === 'Failure' ? (
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
            loadWritersStatus === 'Loading' ? (
              <LoadingOutlined style={{ pointerEvents: 'none' }} />
            ) : undefined
          }
        />
      </Form.Item>
      <Form.Item<FieldType> label='User ID' name='user'>
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type='primary'
          htmlType='submit'
          icon={<SearchOutlined />}
          loading={searchStatus === 'Loading'}
        >
          {searchStatus === 'Loading' ? 'Searching' : 'Search'}
        </Button>
      </Form.Item>
    </Form>
  );
});

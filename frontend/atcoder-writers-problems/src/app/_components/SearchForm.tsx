import { clipDifficulty } from '@/components/external/AtCoderProblems';
import { axiosInstance } from '@/config/axios';
import type { Problem, ProblemResponse } from '@/types';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, type FormProps } from 'antd';
import type { AxiosResponse } from 'axios';
import { memo, useEffect, useState, type FC } from 'react';

export type SearchFormProps = {
  handleProblemsChange: (newProblems: Problem[]) => void;
  handleLoadingWritersErrorChange: (occurred: boolean) => void;
  handleSearchingErrorChange: (occurred: boolean) => void;
};

type FieldType = {
  writer: string;
  user?: string;
};

const createProblemFromProblemResponse = (src: ProblemResponse): Problem => ({
  id: src.id,
  contest: src.contest,
  category: src.category,
  name: src.name,
  difficulty: src.difficulty,
  startEpochSecond: src.start_epoch_second,
  resultCode: src.result_code || 'Yet',
  problemIndex: src.problem_index,
});

const validateMessages: FormProps['validateMessages'] = {
  required: "'${label}' is required!",
};

const createOptions = (wirters: string[]) =>
  wirters.map((writer) => ({
    value: writer,
    label: writer,
  }));

export const SearchForm: FC<SearchFormProps> = memo(
  ({
    handleProblemsChange,
    handleLoadingWritersErrorChange,
    handleSearchingErrorChange,
  }) => {
    const [writers, setWriters] = useState<string[]>([]);
    const [isLoadingWriters, setIsLoadingWriters] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Writer全件取得
    useEffect(() => {
      setIsLoadingWriters(true);
      axiosInstance
        .get('/writers')
        .then((res) => {
          handleLoadingWritersErrorChange(false);
          setWriters(res.data);
        })
        .catch((error) => {
          handleLoadingWritersErrorChange(true);
          console.log('ERROR when getting writers!!');
          console.log(error);
        })
        .then(() => {
          setIsLoadingWriters(false);
        });
    }, []);

    // submit
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
      setIsSearching(true);
      axiosInstance
        .get('/problems', {
          params: {
            writer: values.writer,
            user: values.user || undefined,
          },
        })
        .then((res: AxiosResponse<ProblemResponse[]>) => {
          handleSearchingErrorChange(false);

          // difficultyを丸める
          const difficultyClippedProblems = res.data.map((problem) => ({
            ...createProblemFromProblemResponse(problem),
            difficulty:
              problem.difficulty && clipDifficulty(problem.difficulty),
          }));

          handleProblemsChange(difficultyClippedProblems);
        })
        .catch((error) => {
          handleSearchingErrorChange(true);
          console.log('ERROR when getting problems!!');
          console.log(error);
        })
        .then(() => {
          setIsSearching(false);
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
              isLoadingWriters ? (
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
            loading={isSearching}
          >
            {isSearching ? 'Searching' : 'Search'}
          </Button>
        </Form.Item>
      </Form>
    );
  },
);

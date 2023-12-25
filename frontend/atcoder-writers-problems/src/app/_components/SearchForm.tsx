import { clipDifficulty } from '@/components/external/AtCoderProblems';
import { axiosInstance } from '@/config/axios';
import type { Problem, ProblemResponse } from '@/types';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import type { AxiosResponse } from 'axios';
import {
  memo,
  useEffect,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from 'react';

export type SearchFormProps = {
  setProblems: Dispatch<SetStateAction<Problem[]>>;
  setIsLoadingWritersError: Dispatch<SetStateAction<boolean>>;
  setIsSearchingError: Dispatch<SetStateAction<boolean>>;
};

type FieldType = {
  writer: string;
  user?: string;
};

// TODO:Loadingのみのstateに変更
type LoadStatus = 'Ready' | 'Loading' | 'Success' | 'Failure';

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

const validateMessages = {
  required: "'${label}' is required!",
};

const createOptions = (_wirters: string[]) =>
  _wirters.map((_writer) => ({
    value: _writer,
    label: _writer,
  }));

export const SearchForm: FC<SearchFormProps> = memo(
  ({ setProblems, setIsLoadingWritersError, setIsSearchingError }) => {
    const [writers, setWriters] = useState<string[]>([]);
    const [loadWritersStatus, setLoadWritersStatus] =
      useState<LoadStatus>('Ready');
    const [searchStatus, setSearchStatus] = useState<LoadStatus>('Ready');

    // Writer全件取得
    useEffect(() => {
      setLoadWritersStatus('Loading');
      axiosInstance
        .get('/writers')
        .then((res) => {
          setLoadWritersStatus('Success');
          setIsLoadingWritersError(false);
          setWriters(res.data);
        })
        .catch((error) => {
          setLoadWritersStatus('Failure');
          setIsLoadingWritersError(true);
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
          setIsSearchingError(false);

          // difficultyを丸める
          const difficultyClippedProblems = res.data.map((problem) => ({
            ...createProblemFromProblemResponse(problem),
            difficulty:
              problem.difficulty && clipDifficulty(problem.difficulty),
          }));

          setProblems(difficultyClippedProblems);
        })
        .catch((error) => {
          setSearchStatus('Failure');
          setIsSearchingError(true);
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
  },
);

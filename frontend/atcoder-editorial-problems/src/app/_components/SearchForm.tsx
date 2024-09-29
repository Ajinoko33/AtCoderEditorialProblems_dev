import { GetProblemsParams } from '@/generated/orval/models';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, type FormProps } from 'antd';
import { memo, useCallback, type FC } from 'react';

type FieldType = {
  writer: string;
  user?: string;
};

const validateMessages: FormProps['validateMessages'] = {
  required: "'${label}' is required!",
};

const filterOption = (
  inputValue: string,
  option?: {
    value: string;
    label: string;
  },
) => !!option && option.label.toLowerCase().includes(inputValue.toLowerCase());

const filterSort = (
  optionA: {
    value: string;
    label: string;
  },
  optionB: {
    value: string;
    label: string;
  },
) => {
  const a = optionA.label;
  const b = optionB.label;
  const lowerCompared = a.toLowerCase().localeCompare(b.toLowerCase(), 'en');
  if (lowerCompared === 0) {
    return a.localeCompare(b, 'en');
  } else {
    return lowerCompared;
  }
};

const createOptions = (wirters: string[]) =>
  wirters.map((writer) => ({
    value: writer,
    label: writer,
  }));

export type SearchFormProps = {
  defaultValues?: Partial<FieldType>;
  writers: string[];
  isLoadingWriters?: boolean;
  search?: (newSearchCondition: GetProblemsParams) => void;
  isSearching?: boolean;
};

export const SearchForm: FC<SearchFormProps> = memo((props) => {
  const { defaultValues, writers, isLoadingWriters, search, isSearching } =
    props;

  const onFinish: FormProps<FieldType>['onFinish'] = useCallback(
    (values: FieldType) => {
      search && search(values);
    },
    [search],
  );

  return (
    <Form
      className='w-72'
      initialValues={defaultValues}
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
          filterOption={filterOption}
          filterSort={filterSort}
          options={createOptions(writers)}
          suffixIcon={
            isLoadingWriters ? (
              <LoadingOutlined style={{ pointerEvents: 'none' }} />
            ) : undefined
          }
        />
      </Form.Item>
      <Form.Item<FieldType> label='Your User ID' name='user'>
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
});

SearchForm.displayName = 'SearchForm';

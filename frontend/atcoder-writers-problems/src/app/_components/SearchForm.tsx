import { writersDataOptions } from '@/data/Data';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';

export type FieldType = {
  writer: string;
  user?: string;
};

export const SearchForm = () => {
  return (
    <Form labelCol={{ span: 8 }} style={{ width: 300 }}>
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
          検索
        </Button>
      </Form.Item>
    </Form>
  );
};

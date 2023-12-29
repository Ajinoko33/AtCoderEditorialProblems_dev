'use client';

import { LinkToOutside } from '@/components/LinkToOutside';
import { Typography } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';

export default function Page() {
  return (
    <Typography className='pt-4'>
      {/* TODO: AtCoderのリンク */}
      <Paragraph className='text-base'>
        AtCoder Writer's Problems(AWP)
        は、AtCoderの問題をWriterで検索することができるサービスです。
        <br />
        苦手意識のあるWriterの対策もこれで大丈夫!!
      </Paragraph>

      <Title>管理者</Title>

      <Paragraph className='text-base'>
        Ajinoko
        <ul>
          <li>
            X(Twitter):{' '}
            <LinkToOutside
              href='https://twitter.com/Ajinoko33'
              text='@Ajinoko33'
              iconSize='small'
            />
          </li>
          <li>
            Github:{' '}
            <LinkToOutside
              href='https://github.com/Ajinoko33'
              text='Ajinoko33'
              iconSize='small'
            />
          </li>
        </ul>
      </Paragraph>
    </Typography>
  );
}

'use client';

import { Layout } from 'antd';
import type { FC, ReactNode } from 'react';
import { Header } from './Header';
import { MainContent } from './MainContent';

export type StyleProps = {
  children: ReactNode;
};

export const Style: FC<StyleProps> = ({ children }) => {
  const style = {
    background: 'white',
  };

  return (
    <Layout style={style}>
      <Header />
      <MainContent>{children}</MainContent>
    </Layout>
  );
};

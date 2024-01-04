'use client';

import { Layout as AntDLayout } from 'antd';
import type { FC, ReactNode } from 'react';
import { Header } from './Header';
import { MainContent } from './MainContent';

export type StyleProps = {
  children: ReactNode;
};

export const Layout: FC<StyleProps> = ({ children }) => {
  const style = {
    background: 'white',
  };

  return (
    <AntDLayout style={style}>
      <Header />
      <MainContent>{children}</MainContent>
    </AntDLayout>
  );
};

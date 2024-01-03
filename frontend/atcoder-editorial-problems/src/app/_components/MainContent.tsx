import { Layout } from 'antd';
import { FC, ReactNode } from 'react';

export type MainContentType = {
  children: ReactNode;
};

export const MainContent: FC<MainContentType> = ({ children }) => {
  const style = {
    maxWidth: '42rem',
    margin: '0 auto',
    padding: '1rem',
  };

  return <Layout.Content style={style}>{children}</Layout.Content>;
};

import { FC } from 'react';

export type MainContainerProps = {
  children: React.ReactNode;
};

export const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return <main className='container max-w-2xl mx-auto mt-6'>{children}</main>;
};

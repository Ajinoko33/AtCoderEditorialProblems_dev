import type { FC } from 'react';

export type MainContainerProps = {
  children: React.ReactNode;
};

export const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return (
    <main className='container max-w-2xl mx-auto pt-4 px-4'>{children}</main>
  );
};

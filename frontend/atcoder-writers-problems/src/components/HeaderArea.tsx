import { FC } from 'react';

export type HeaderAreaProps = {
  title: string;
  children: React.ReactNode;
};

export const HeaderArea: FC<HeaderAreaProps> = ({ title, children }) => {
  return (
    <nav className='container'>
      {/* <HeaderTitle title={title}></HeaderTitle> */}
      {children}
    </nav>
  );
};

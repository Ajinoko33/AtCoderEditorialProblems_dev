import { FC } from 'react';

export type MainContainerProps = {
  children: React.ReactNode;
};

export const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return (
    <main>
      {/* <div
        // w='40rem'
        mt='1rem'
        mx='auto'
        px='15px'
        borderColor='red'
        border='solid'
        borderWidth='1px'
      > */}
      {children}
      {/* </div> */}
    </main>
  );
};

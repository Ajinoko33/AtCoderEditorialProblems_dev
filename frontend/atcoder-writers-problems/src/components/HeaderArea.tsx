import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { HeaderTitle } from './HeaderTitle';

export type HeaderAreaProps = {
  title: string;
  children: React.ReactNode;
};

export const HeaderArea: FC<HeaderAreaProps> = ({ title, children }) => {
  return (
    <Flex
      as='nav'
      px='1rem'
      alignItems='center'
      bg='brand.100'
      position='sticky'
      top='0'
    >
      <HeaderTitle title={title}></HeaderTitle>
      {children}
    </Flex>
  );
};

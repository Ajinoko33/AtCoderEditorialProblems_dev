import { Box } from '@chakra-ui/react';
import { FC } from 'react';

export type MainContainerProps = {
  children: React.ReactNode;
};

export const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return (
    <Box as='main'>
      <Box
        // w='40rem'
        mt='1rem'
        mx='auto'
        px='15px'
        borderColor='red'
        border='solid'
        borderWidth='1px'
      >
        {children}
      </Box>
    </Box>
  );
};

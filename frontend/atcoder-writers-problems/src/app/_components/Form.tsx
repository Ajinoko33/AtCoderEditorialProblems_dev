import { SearchableSelect } from '@/components/SearchableSelect';
import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FC } from 'react';

export type FormProps = {
  writers: string[];
};

export const Form: FC<FormProps> = ({ writers }) => {
  return (
    <Box>
      <FormControl isRequired>
        <FormLabel mb='0'>Writer</FormLabel>
        <SearchableSelect writers={writers} />
      </FormControl>
      <FormControl mt='0.8rem'>
        <FormLabel mb='0'>User ID</FormLabel>
        <Input type='text' />
      </FormControl>
    </Box>
  );
};

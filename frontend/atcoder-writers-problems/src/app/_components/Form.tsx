import { SearchableSelect } from '../../components/SearchableSelect';
import { Writer } from '../../types/Writer';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  defineStyle,
  defineStyleConfig,
} from '@chakra-ui/react';
import { FC } from 'react';

export type FormProps = {
  writers: Writer[];
};

export const Form: FC<FormProps> = ({ writers }) => {
  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel mb='0'>Writer</FormLabel>
        <SearchableSelect writers={writers} />
      </FormControl>
      <FormControl mb='0.8rem'>
        <FormLabel mb='0'>User ID</FormLabel>
        <Input type='text' />
      </FormControl>
      <Button
        leftIcon={<SearchIcon />}
        variant='outline'
        bg='brand.100'
        borderColor='brand.100'
        fontWeight='normal'
        _hover={{ bg: 'brand.200' }}
      >
        検索
      </Button>
    </VStack>
  );
};

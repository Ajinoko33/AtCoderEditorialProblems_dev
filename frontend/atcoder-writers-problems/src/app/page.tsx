'use client';

import { HeaderMenuItem } from '@/components/HeaderMenuItem';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { Form, FormProps } from './_components/Form';

export default function Home() {
  const writers = ['aaaa', 'AAAAA', 'BBAAAAAA', 'BBBB', 'cccc'];

  return (
    <Flex alignItems='center' justifyContent='center'>
      <Form writers={writers} />
    </Flex>
  );
}

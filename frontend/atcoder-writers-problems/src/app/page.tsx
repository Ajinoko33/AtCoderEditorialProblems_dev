'use client';

import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { Form } from './_components/Form';
import { useState } from 'react';
import { problemsData, writersData } from '@/data/Data';

export default function Home() {
  const [writers, setWriters] = useState(writersData);
  const [problems, setProblems] = useState(problemsData);

  //TODO: problemsをABC,ARCに分ける

  return (
    <VStack spacing='3rem'>
      <Form writers={writers} />
      <Tabs>
        <TabList>
          <Tab>ABC</Tab>
          <Tab>ARC</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>This is ABC.</p>
          </TabPanel>
          <TabPanel>
            <p>This is ARC.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}

import { Writer } from '@/types/Writer';
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { Box, InputGroup, InputRightElement } from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { FC, useRef } from 'react';

export type SearchableSelectProps = {
  writers: Writer[];
};

export const SearchableSelect: FC<SearchableSelectProps> = ({ writers }) => {
  const ref = useRef<HTMLInputElement>(null);

  const onClick = () => {
    ref.current?.focus();
  };

  return (
    <Box onClick={onClick}>
      <AutoComplete suggestWhenEmpty={true} openOnFocus>
        {({ isOpen }: { isOpen: boolean }) => (
          <>
            <InputGroup>
              <AutoCompleteInput ref={ref} />
              <InputRightElement style={{ cursor: 'text' }}>
                {isOpen ? <SearchIcon /> : <ChevronDownIcon />}
              </InputRightElement>
            </InputGroup>
            <AutoCompleteList>
              {writers.map((writer, idx) => {
                return (
                  <AutoCompleteItem key={idx} value={writer.id}>
                    {writer.id}
                  </AutoCompleteItem>
                );
              })}
            </AutoCompleteList>
          </>
        )}
      </AutoComplete>
    </Box>
  );
};

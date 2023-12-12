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
  writers: string[];
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
              <InputRightElement>
                {isOpen ? <SearchIcon /> : <ChevronDownIcon />}
              </InputRightElement>
            </InputGroup>
            <AutoCompleteList>
              {writers.map((name, idx) => {
                return (
                  <AutoCompleteItem key={idx} value={name}>
                    {name}
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

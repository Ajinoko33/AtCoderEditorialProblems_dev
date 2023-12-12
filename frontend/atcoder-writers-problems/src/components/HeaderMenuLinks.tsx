'use client';

import { ChevronDownIcon, ExternalLinkIcon, LinkIcon } from '@chakra-ui/icons';
import { Box, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FC } from 'react';

export type HeaderMenuLinkType = {
  label: string;
  url: string;
  isExternal: boolean;
};

export type HeaderMenuLinksProps = {
  label: string;
  items: HeaderMenuLinkType[];
};

export const HeaderMenuLinks: FC<HeaderMenuLinksProps> = ({ label, items }) => {
  return (
    <Box
      px='0.3125rem'
      py='0.5rem'
      _hover={{ bg: 'brand.200' }}
      _expanded={{ bg: 'brand.200' }}
    >
      <Menu>
        <MenuButton
          _focusVisible={{ boxShadow: 'var(--chakra-shadows-outline)' }}
        >
          <Box as='span' mr='0.3125rem'>
            <LinkIcon />
          </Box>
          {label}
          <ChevronDownIcon />
        </MenuButton>
        <MenuList borderRadius='0.5rem' bg='brand.100'>
          {items.map((item, idx) => {
            const { label, url, isExternal } = item;
            return (
              <MenuItem
                key={idx}
                as='a'
                href={url}
                bg='brand.100'
                rel='noreferrer noopener'
                _hover={{ bg: 'brand.200' }}
                {...(isExternal ? { target: '_blank' } : {})}
              >
                <Box as='span' mr='0.3125rem'>
                  {label}
                </Box>
                {isExternal && <ExternalLinkIcon color='gray' />}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};

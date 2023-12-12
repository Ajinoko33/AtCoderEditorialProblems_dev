'use client';

import { Box, Link } from '@chakra-ui/react';
import { FC } from 'react';

export type HeaderMenuItemProps = {
  label: string;
  url: string;
  icon: React.ReactNode;
};

export const HeaderMenuItem: FC<HeaderMenuItemProps> = ({
  label,
  url,
  icon,
}) => {
  return (
    <Link
      href={url}
      px='0.3125rem'
      py='0.5rem'
      textAlign='center'
      _hover={{ bg: 'brand.200' }}
    >
      <Box as='span' mr='0.3125rem'>
        {icon}
      </Box>
      {label}
    </Link>
  );
};

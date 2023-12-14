'use client';

import { HeaderLogo } from './HeaderLogo';
import { HeaderMenu } from './HeaderMenu';

export const Header = () => {
  return (
    <nav className='container flex'>
      <div>
        <HeaderLogo />
      </div>
      <div>
        <HeaderMenu />
      </div>
    </nav>
  );
};

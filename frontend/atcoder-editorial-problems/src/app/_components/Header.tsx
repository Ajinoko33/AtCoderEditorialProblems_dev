'use client';

import { HeaderMain } from './HeaderMain';
import { HeaderMenu } from './HeaderMenu';

export const Header = () => {
  // TODO:レスポンシブで，画面幅が一定以下ではMenuをハンバーガーに．
  return (
    <nav className='flex items-center px-4 border-b-[#0505050F] border-b-2'>
      <div className='flex-none mr-4'>
        <HeaderMain />
      </div>
      <div className='flex-auto'>
        <HeaderMenu />
      </div>
    </nav>
  );
};

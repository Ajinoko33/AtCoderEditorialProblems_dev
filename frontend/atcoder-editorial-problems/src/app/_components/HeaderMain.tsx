import Link from 'next/link';

export const HeaderMain = () => {
  return (
    <Link
      href='/'
      className='font-bold no-underline text-black mr-3 text-base min-w-max'
    >
      AtCoder Editorial Problems
    </Link>
  );
};

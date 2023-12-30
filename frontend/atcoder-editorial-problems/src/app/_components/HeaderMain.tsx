import Link from 'next/link';

export const HeaderMain = () => {
  return (
    <Link href='/' className='font-bold no-underline text-black'>
      AtCoder Editorial Problems
    </Link>
  );
};
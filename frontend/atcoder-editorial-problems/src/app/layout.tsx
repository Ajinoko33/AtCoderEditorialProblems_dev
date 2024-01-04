import StyledComponentsRegistry from '@/lib/AntdRegistry';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Layout } from './_components/Layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AtCoder Editorial Problems',
  description: 'AtCoderの問題を解説の筆者から検索することができます。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <Layout>{children}</Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

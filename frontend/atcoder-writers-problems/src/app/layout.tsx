import { MainContainer } from '@/components/MainContainer';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from './_components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "AtCoder Writer's Problems",
  description: 'AtCoderの問題をWriterで検索することができます!!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <Header />
        <MainContainer>{children}</MainContainer>
      </body>
    </html>
  );
}

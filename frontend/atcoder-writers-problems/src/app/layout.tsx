import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from './_components/Header';
import { MainContainer } from '@/components/MainContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <Providers>
          <Header />
          <MainContainer>{children}</MainContainer>
        </Providers>
      </body>
    </html>
  );
}

import { ContextProviders, Layout } from '@/components/app';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
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
          <ContextProviders>
            <Layout>{children}</Layout>
          </ContextProviders>
        </StyledComponentsRegistry>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
    </html>
  );
}

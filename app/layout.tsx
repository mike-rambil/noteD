import { ThemeProvider } from '@/lib/providers/next-theme-provider';
import AppStateProvider from '@/lib/providers/state-provider';
// import db from '@/lib/supabase/db';
import { SupabaseUserProvider } from '@/lib/providers/supabase-user-provider';
import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import './globals.css';
// console.log('🚀 ~ file: layout.tsx:3 ~ db:', db);

const inter = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'noteD',
  description: 'Mark it Down..',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={twMerge('bg-background', inter.className)}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <AppStateProvider>
            <SupabaseUserProvider>{children}</SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

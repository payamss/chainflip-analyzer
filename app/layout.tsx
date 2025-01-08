'use client';
import '@/styles/globals.css';
import Link from 'next/link';
import { ApolloProvider } from '@apollo/client';
import client from './range-orders/graphql/client'; // Adjust the import path if needed

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='relative bg-black text-white'>
        <ApolloProvider client={client}>
          {/* Fixed Navbar */}
          <nav className='fixed top-0 z-10 w-full bg-accent p-3 pl-10'>
            <Link href='/' className='mr-4'>
              Home
            </Link>
            <Link href='/range-orders'>Range Orders</Link>
          </nav>

          {/* Allow full children size (no forced height) */}
          <main className='p-4 pb-[5rem] pt-[4rem]'>{children}</main>

          {/* Fixed Footer */}
          <footer className='fixed bottom-0 z-10 h-16 w-full bg-accent p-3 text-center'>
            <div>
              Designed and developed by{' '}
              <a href='https://shariat.de' target='_blank' className='underline'>
                Shariat.de
              </a>
            </div>
            <div>&copy; {new Date().getFullYear()}</div>
          </footer>
        </ApolloProvider>
      </body>
    </html>
  );
}

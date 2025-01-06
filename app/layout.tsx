'use client';
import "@/styles/globals.css";
import Link from 'next/link';
import { ApolloProvider } from '@apollo/client';
import client from './open-orders/graphql/client'; // Adjust the import path if needed



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body >
        <ApolloProvider client={client}>
          <nav className="p-3 pl-10 space-x-5 bg-secondary text-white">
            <Link href="/" className="mr-4">Home</Link>
            <Link href="/open-orders">Orders</Link>
          </nav>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
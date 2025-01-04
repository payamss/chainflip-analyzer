'use client';
import "@/styles/globals.css";
import Link from 'next/link';
import { ApolloProvider } from '@apollo/client';
import client from './orders/graphql/client'; // Adjust the import path if needed



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <nav className="p-4 bg-gray-800 text-white">
            <Link href="/" className="mr-4">Home</Link>
            <Link href="/orders">Orders</Link>
          </nav>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
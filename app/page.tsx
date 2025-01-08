import React from 'react';
import '../styles/globals.css'; // Import the CSS file
import TokenPricesDisplay from './range-orders/components/TokenPricesDisplay';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <TokenPricesDisplay />
    </div>
  );
}

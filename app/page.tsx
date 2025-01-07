import React from 'react';
import '../styles/globals.css'; // Import the CSS file
import TokenPricesDisplay from './range-orders/components/TokenPricesDisplay';

export default function Home() {
  return (
    <div className=" px-4 flex items-center justify-center min-h-screen ">

      <TokenPricesDisplay />
    </div>
  );
}

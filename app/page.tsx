import React from 'react';
import '../styles/globals.css'; // Import the CSS file

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="border-2 border-pink-700 p-16 w-1/2 text-center shadow-lg rounded-lg bg-accent">
        <h1 className="text-3xl font-bold mb-4">Welcome to Chainflip Analyzer</h1>
        <p className="text-lg">Analyze your Chainflip Liquidity with ease.</p>
      </div>
    </div>
  );
}

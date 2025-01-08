'use client';

import React from 'react';
import { useTokenPrices } from '@/app/hooks/useTokenPrices';
import { useAssetIconCache } from '@/app/hooks/useAssetIconCache';
import Image from 'next/image';

const TokenPricesDisplay = () => {
  const { data, loading, error } = useTokenPrices();
  const getAssetIcon = useAssetIconCache();

  if (loading) return <p className="text-center">Loading token prices...</p>;
  if (error) return <p className="text-center">Error: {error.message}</p>;

  return (
    <div className="border-2 border-pink-700 p-6 md:p-12 w-full sm:w-3/4 lg:w-1/2 mx-auto text-center shadow-lg rounded-lg bg-accent">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
        Welcome to Chainflip Analyzer
      </h1>
      <p className="text-sm sm:text-base md:text-lg">
        Analyze your Chainflip Liquidity with ease.
      </p>
      <hr className="m-4" />
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Token Prices</h2>
      <div className="justify-center flex flex-wrap gap-4">
        {' '}
        <div className="justify-center flex flex-wrap gap-4">
          <ul className="space-y-2">
            {Object.entries(data).map(([token, price]) => (
              <li
                key={token}
                className="flex items-center gap-4 sm:gap-2 sm:justify-start"
              >
                <div className="relative inline-block w-6 h-6 sm:w-8 sm:h-8">
                  <Image
                    src={getAssetIcon(token || '').assetIcon}
                    alt={token}
                    className="inline-block"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="font-medium text-sm sm:text-base">
                  {token}:
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  ${price.toFixed(4)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenPricesDisplay;

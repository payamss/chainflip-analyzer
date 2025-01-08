'use client';

import React from 'react';
import { useTokenPrices } from '@/app/hooks/useTokenPrices';
import { useAssetIconCache } from '@/app/hooks/useAssetIconCache';
import Image from 'next/image';

const TokenPricesDisplay = () => {
  const { data, loading, error } = useTokenPrices();
  const getAssetIcon = useAssetIconCache();

  if (loading) return <p className='text-center'>Loading token prices...</p>;
  if (error) return <p className='text-center'>Error: {error.message}</p>;

  return (
    <div className='mx-auto w-full rounded-lg border-2 border-pink-700 bg-accent p-6 text-center shadow-lg sm:w-3/4 md:p-12 lg:w-1/2'>
      <h1 className='mb-4 text-xl font-bold sm:text-2xl md:text-3xl'>
        Welcome to Chainflip Analyzer
      </h1>
      <p className='text-sm sm:text-base md:text-lg'>Analyze your Chainflip Liquidity with ease.</p>
      <hr className='m-4' />
      <h2 className='mb-4 text-lg font-semibold sm:text-xl'>Token Prices</h2>
      <div className='flex flex-wrap justify-center gap-4'>
        {' '}
        <div className='flex flex-wrap justify-center gap-4'>
          <ul className='space-y-2'>
            {Object.entries(data).map(([token, price]) => (
              <li key={token} className='flex items-center gap-4 sm:justify-start sm:gap-2'>
                <div className='relative inline-block h-6 w-6 sm:h-8 sm:w-8'>
                  <Image
                    src={getAssetIcon(token || '').assetIcon}
                    alt={token}
                    className='inline-block'
                    width={32}
                    height={32}
                  />
                </div>
                <span className='text-sm font-medium sm:text-base'>{token}:</span>
                <span className='text-sm font-semibold sm:text-base'>${price.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenPricesDisplay;

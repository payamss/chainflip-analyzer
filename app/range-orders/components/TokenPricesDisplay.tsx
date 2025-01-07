/* components/TokenPricesDisplay.tsx */

"use client";

import React from "react";
import { useTokenPrices } from "@/app/hooks/useTokenPrices";
import { useAssetIconCache } from "@/app/hooks/useAssetIconCache";
import Image from "next/image";

const TokenPricesDisplay = () => {
  const { data, loading, error } = useTokenPrices();
  const getAssetIcon = useAssetIconCache();

  if (loading) return <p>Loading token prices...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (

    <div className="border-2  border-pink-700 p-16 w-1/2 text-center shadow-lg rounded-lg bg-accent">
      <h1 className="text-3xl font-bold mb-4">Welcome to Chainflip Analyzer</h1>
      <p className="text-lg">Analyze your Chainflip Liquidity with ease.</p>
      <hr className="m-4" />
      <h2 className="text-xl font-semibold mb-4">Token Prices</h2>
      <div className="justify-center flex ">
        <ul className="space-y-2 ">
          {Object.entries(data).map(([token, price]) => (
            <li key={token} className="flex items-center gap-2">
              <div className="relative inline-block w-8 h-8 ">
                <Image
                  src={getAssetIcon(token || '').assetIcon}
                  alt={token}
                  className="inline-block w-8 h-8"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-medium ">{token}:</span>

              <span>${price.toFixed(4)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>


  );
};

export default TokenPricesDisplay;

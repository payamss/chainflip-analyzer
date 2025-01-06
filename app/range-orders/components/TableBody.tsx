/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { calculateCorrectAmount, calculatePriceFromTick } from '@/utils/calculateMetrics';
import Image from 'next/image';
const TableBody = ({ currentItems }: { currentItems: any[] }) => {
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    alert(`Copied ID: ${id}`);
  };

  // Memoization helper
  const useAssetIconCache = () => {
    const cache = useMemo(() => new Map<string, { assetIcon: string; chainIcon: string | null }>(), []);

    return (asset: string) => {
      if (!cache.has(asset)) {
        const lowerAsset = asset.toLowerCase();

        // Match for chain prefixes (arb, sol, dot, eth, btc)
        const chainMatch = lowerAsset.match(/(arb|sol|dot|eth|btc)/);
        const chain = chainMatch ? chainMatch[0] : null;

        // Extract main asset without chain prefix
        let mainAsset = lowerAsset.replace(/(arb|sol|dot|eth|btc)/, '').trim();

        // Handle cases where the asset matches the chain (e.g., sol -> sol, eth -> eth)
        if (!mainAsset) {
          mainAsset = chain ? chain : 'default'; // Default fallback if no asset name is provided
        }

        // Determine icons
        const assetIcon = `/icons/${mainAsset}.svg`;
        const chainIcon = chain ? `/icons/${chain}-chain.svg` : `/icons/eth-chain.svg`; // Use `-chain` for chains

        // Save in cache
        cache.set(asset, { assetIcon, chainIcon });
      }
      return cache.get(asset)!;
    };
  };




  const getAssetIcon = useAssetIconCache();

  return (
    <tbody>
      {currentItems.map((order, index) => {
        const baseAmount = calculateCorrectAmount(order.baseAmount, order.baseAsset);
        const quoteAmount = calculateCorrectAmount(order.quoteAmount, order.quoteAsset);

        const lowerPrice = calculatePriceFromTick(order.lowerTick);
        const upperPrice = calculatePriceFromTick(order.upperTick);
        const accountLink = order.accountId
          ? `https://lp.chainflip.io/orders?accountId=${order.accountId}`
          : null;

        const baseIcons = getAssetIcon(order.baseAsset || '');
        const quoteIcons = getAssetIcon(order.quoteAsset || '');

        return (
          <tr key={`${order.apr}-${index}`} className="even:bg-accent odd:bg-secondary text-center items-center">
            <td className="p-2">{order.status}</td>
            <td
              className="p-2 text-primary hover:underline cursor-pointer"
              onClick={() => handleCopy(order.accountId)}
            >
              {order.accountId ? `${order.accountId.slice(0, 3)}...${order.accountId.slice(-3)}` : 'N/A'}
            </td>
            <td className="p-2">
              <div className="flex items-center gap-4" >
                {baseIcons.assetIcon && (
                  <div className="relative inline-block w-8 h-8 ">
                    <Image
                      src={baseIcons.assetIcon}
                      alt={order.baseAsset}
                      className="inline-block w-8 h-8"
                      width={32}
                      height={32}
                    />
                    {baseIcons.chainIcon && (
                      <Image
                        src={baseIcons.chainIcon}
                        alt={`${order.baseAsset}-chain`}
                        className="absolute -bottom-1 -right-2 w-5 h-5 bg-secondary rounded-full"
                        width={12}
                        height={12}
                      />
                    )}
                  </div>
                )}
                <span>{baseAmount}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                {quoteIcons.assetIcon && (
                  <div className="relative inline-block">
                    <Image
                      src={quoteIcons.assetIcon}
                      alt={order.quoteAsset}
                      className="inline-block w-8 h-8"
                      width={32}
                      height={32}
                    />
                    {quoteIcons.chainIcon && (
                      <Image
                        src={quoteIcons.chainIcon}
                        alt={`${order.quoteAsset}-chain`}
                        className="absolute -bottom-1 -right-2 w-5 h-5 bg-secondary rounded-full"
                        width={12}
                        height={12}
                      />
                    )}
                  </div>
                )}
                <span>{quoteAmount}</span>
              </div>
            </td>
            <td className="p-2">${order.orderValue.toFixed(2)}</td>
            <td className="  p-2 justify-center items-center text-center">
              <div className="flex items-center gap-2 justify-center">

                <div className="flex-shrink-0">{`${lowerPrice.toFixed(5)}`}</div>
                <Image
                  src="/range.svg"
                  alt={`${order.quoteAsset}-chain`}
                  className="w-5 h-5"
                  width={16}
                  style={{
                    filter: 'brightness(0) saturate(0) invert(60%)',
                  }}
                  height={16}
                />
                <div className="flex-shrink-0">{`${upperPrice.toFixed(5)}`}</div>
              </div>

            </td>
            <td className="p-2">${order.earnedFees.toFixed(6)}</td>
            <td className="p-2">{order.duration} days</td>
            <td className="p-2">{order.dpr}%</td>
            <td className="p-2">{order.mpr}%</td>
            <td className="p-2">{order.apr}%</td>
            <td className="p-2 ">
              {accountLink ? (
                <a
                  href={accountLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-white bg-gray-900 hover:bg-border rounded-md"
                >
                  View
                </a>
              ) : (
                'N/A'
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;

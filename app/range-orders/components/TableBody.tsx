/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { calculateCorrectAmount, calculatePriceFromTick } from '@/utils/calculateMetrics';
import Image from 'next/image';
import { useAssetIconCache } from '@/app/hooks/useAssetIconCache';
import { FaInfinity, FaCheck, FaCopy } from 'react-icons/fa6';

const TableBody = ({ currentItems }: { currentItems: any[] }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (id: string, index: number) => {
    navigator.clipboard.writeText(id);

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 3000);
  };

  const getAssetIcon = useAssetIconCache();

  return (
    <tbody>
      {currentItems.map((order, index) => {
        const baseAmount = calculateCorrectAmount(order.baseAmount, order.baseAsset);
        const quoteAmount = calculateCorrectAmount(order.quoteAmount, order.quoteAsset);
        const lowerPrice = calculatePriceFromTick(order.lowerTick);
        let upperPrice = calculatePriceFromTick(order.upperTick);

        if (upperPrice >= 3.4025678683306347e38) {
          upperPrice = Infinity;
        }

        const accountLink = order.accountId
          ? `https://lp.chainflip.io/orders?accountId=${order.accountId}`
          : null;

        const baseIcons = getAssetIcon(order.baseAsset || '');
        const quoteIcons = getAssetIcon(order.quoteAsset || '');

        return (
          <tr
            key={`${order.apr}-${index}`}
            className='items-center text-center odd:bg-secondary even:bg-accent'
          >
            {/* Status */}
            <td className='p-2'>{order.status}</td>

            {/* Account ID + Copy Icon */}
            <td className='p-2 text-primary'>
              {order.accountId ? (
                <div className='flex items-center justify-center gap-2'>
                  {/* Truncated ID text */}
                  <span>
                    {order.accountId.slice(0, 3)}...{order.accountId.slice(-3)}
                  </span>

                  {/* Copy or Check Icon */}
                  {copiedIndex === index ? (
                    <FaCheck className='inline-block text-green-500' />
                  ) : (
                    <FaCopy
                      className='inline-block cursor-pointer text-neutral-600 hover:text-neutral-500'
                      onClick={() => handleCopy(order.accountId, index)}
                    />
                  )}
                </div>
              ) : (
                'N/A'
              )}
            </td>

            {/* Base/Quote */}
            <td className='p-2'>
              <div className='flex items-center gap-4'>
                {baseIcons.assetIcon && (
                  <div className='relative inline-block h-8 w-8'>
                    <Image
                      src={baseIcons.assetIcon}
                      alt={order.baseAsset}
                      className='inline-block h-8 w-8'
                      width={32}
                      height={32}
                    />
                    {baseIcons.chainIcon && (
                      <Image
                        src={baseIcons.chainIcon}
                        alt={`${order.baseAsset}-chain`}
                        className='absolute -bottom-1 -right-2 h-5 w-5 rounded-full bg-secondary'
                        width={12}
                        height={12}
                      />
                    )}
                  </div>
                )}
                <span>{baseAmount}</span>
              </div>
              <div className='mt-2 flex items-center gap-4'>
                {quoteIcons.assetIcon && (
                  <div className='relative inline-block h-8 w-8'>
                    <Image
                      src={quoteIcons.assetIcon}
                      alt={order.quoteAsset}
                      className='inline-block h-8 w-8'
                      width={32}
                      height={32}
                    />
                    {quoteIcons.chainIcon && (
                      <Image
                        src={quoteIcons.chainIcon}
                        alt={`${order.quoteAsset}-chain`}
                        className='absolute -bottom-1 -right-2 h-5 w-5 rounded-full bg-secondary'
                        width={12}
                        height={12}
                      />
                    )}
                  </div>
                )}
                <span>{quoteAmount}</span>
              </div>
            </td>

            {/* Order Value */}
            <td className='p-2'>${order.orderValue.toFixed(2)}</td>

            {/* Price Range */}
            <td className='items-center justify-center p-2 text-center'>
              <div className='flex items-center justify-center gap-2'>
                <div className='flex-shrink-0'>{lowerPrice.toFixed(5)}</div>
                <Image
                  src='/range.svg'
                  alt={`${order.quoteAsset}-chain`}
                  className='h-5 w-5'
                  width={16}
                  height={16}
                  style={{ filter: 'brightness(0) saturate(0) invert(60%)' }}
                />
                <div className='flex-shrink-0'>
                  {upperPrice !== Infinity ? upperPrice.toFixed(5) : <FaInfinity />}
                </div>
              </div>
            </td>

            {/* Earned Fees */}
            <td className='p-2'>${order.earnedFees.toFixed(6)}</td>

            {/* Duration, DPR, MPR, APR */}
            <td className='p-2'>{order.duration} days</td>
            <td className='p-2'>{order.dpr}%</td>
            <td className='p-2'>{order.mpr}%</td>
            <td className='p-2'>{order.apr}%</td>

            {/* View Link */}
            <td className='p-2'>
              {accountLink ? (
                <a
                  href={accountLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='rounded-md bg-neutral-900 px-3 py-2 text-white hover:bg-neutral-800'
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

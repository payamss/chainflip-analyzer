/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { calculatePriceFromTick } from '@/utils/calculateMetrics';

const TableBody = ({ currentItems }: { currentItems: any[] }) => {
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    alert(`Copied ID: ${id}`);
  };

  return (
    <tbody>
      {currentItems.map((order, index) => {
        const baseAmount = (parseFloat(order.baseAmount || 0) / 1e18).toFixed(6);
        const quoteAmount = (parseFloat(order.quoteAmount || 0) / 1e6).toFixed(6);
        const lowerPrice = calculatePriceFromTick(order.lowerTick);
        const upperPrice = calculatePriceFromTick(order.upperTick);
        const accountLink = order.accountId
          ? `https://lp.chainflip.io/orders?accountId=${order.accountId}`
          : null;

        return (
          <tr key={`${order.apr}-${index}`} className="even:bg-accent odd:bg-secondary text-center">
            <td className="p-4">{order.status}</td>
            <td
              className="p-4 text-primary hover:underline cursor-pointer"
              onClick={() => handleCopy(order.accountId)}
            >
              {order.accountId ? `${order.accountId.slice(0, 3)}...${order.accountId.slice(-3)}` : 'N/A'}
            </td>
            <td className="p-4">{order.orderType || 'N/A'}</td>
            <td className="p-4">
              <div>{`${baseAmount} ${order.baseAsset || 'N/A'}`}</div>
              <div>{`${quoteAmount} ${order.quoteAsset || 'N/A'}`}</div>
            </td>
            <td className="p-4">${order.orderValue.toFixed(2)}</td>
            <td className="p-4">
              <div>{`Lower: ${lowerPrice.toFixed(6)}`}</div>
              <div>{`Upper: ${upperPrice.toFixed(6)}`}</div>
            </td>
            <td className="p-4">${order.earnedFees.toFixed(6)}</td>
            <td className="p-4">{order.duration} days</td>
            <td className="p-4">{order.dpr}%</td>
            <td className="p-4">{order.mpr}%</td>
            <td className="p-4">{order.apr}%</td>
            <td className="p-4 ">
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

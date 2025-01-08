/* hooks/useTokenPrices.ts */

'use client';

import { useState, useEffect } from 'react';
import getAllTokenPrices from '@/utils/tokenPrice';

export const useTokenPrices = () => {
  const [data, setData] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        const prices = await getAllTokenPrices();
        setData(prices);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []); // Run on mount

  return { data, loading, error };
};

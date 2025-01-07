  // Memoization helper
  import { useMemo } from 'react';

   export const useAssetIconCache = () => {
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

import { tokenPrices } from "@/app/range-orders/components/tokenPrices";

/**
 * Calculates the number of days between two timestamps.
 */
export function calculateDuration(startTimestamp: string, endTimestamp: string): number {

  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);
  const diffTime = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return Math.max(days, 0); // Ensure non-negative value
}

/**
 * Sums earned fees from `quoteCollectedFeesUsd` and `baseCollectedFeesUsd`.
 */
export function calculateTotalFees(order: { quoteCollectedFeesUsd: string; baseCollectedFeesUsd: string }): number {
  const quoteFees = parseFloat(order.quoteCollectedFeesUsd) || 0;
  const baseFees = parseFloat(order.baseCollectedFeesUsd) || 0;
  return +(quoteFees + baseFees).toFixed(6); // Ensure precision
}

/**
 * Calculates Daily Percentage Rate (DPR).
 */
export function calculateDPR(totalFees: number, orderValue: number, duration: number): number {
  if (totalFees <= 0 || orderValue <= 0 || duration <= 0) {
    return 0; // Handle invalid inputs
  }
  const dpr = (totalFees / (orderValue * duration)) * 100;
  return +dpr.toFixed(2); // Return percentage with 2 decimal places
}

/**
 * Calculates Monthly Percentage Rate (MPR) based on DPR.
 */
export function calculateMPR(dpr: number): number {
  return +(dpr * 30).toFixed(2); // Scale DPR to monthly
}

/**
 * Calculates Annual Percentage Rate (APR) based on DPR.
 */
export function calculateAPR(dpr: number): number {
  return +(dpr * 365).toFixed(2); // Scale DPR to yearly
}

/**
 * Converts a tick value to its corresponding price using the tick formula.
 */
export const calculatePriceFromTick = (tick: number): number => {
  return Math.pow(1.0001, tick);
};

// Token Map for Asset Symbols to Addresses
const tokenMap: { [key: string]: { address: string; chainId: string } } = {
  BTC: { address: "0x0000000000000000000000000000000000000000", chainId: "btc" },
  Usdc: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", chainId: "evm-1" },
  ArbUsdc: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", chainId: "evm-42161" },
  ArbEth: { address: "0x0000000000000000000000000000000000000000", chainId: "evm-42161" },
  USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", chainId: "evm-1" },
  ETH: { address: "0x0000000000000000000000000000000000000000", chainId: "evm-1" },
  SOL: { address: "0x0000000000000000000000000000000000000000", chainId: "sol" },
  EPJ: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", chainId: "sol" },
  DOT: { address: "0x0000000000000000000000000000000000000000", chainId: "dot" },
  Flip: { address: "0x826180541412D574cf1336d22c0C0a287822678A", chainId: "evm-1" },
};

/**
 * Fetches the USD price for a given token based on its name.
 */
export function getUsdPriceForToken(tokenName: string): number {
  const tokenInfo = tokenMap[tokenName];

  if (!tokenInfo) {
    console.warn(`Token not found in the map: ${tokenName}`);
    return 0;
  }

  const { address, chainId } = tokenInfo;

  const tokenPriceData = tokenPrices.data.tokenPrices.find(
    (price) => price.chainId === chainId && price.address === address
  );

  if (!tokenPriceData) {
    console.warn(`Price data not found for token: ${tokenName}`);
    return 0;
  }

  return tokenPriceData.usdPrice;
}

/**
 * Calculates the total value in USD for an order.
 */
export function calculateOrderValue(order: { baseAmount: string; quoteAmount: string; baseAsset: string; quoteAsset: string }): number {
  const baseAmount = parseFloat(order.baseAmount) / 1e18; // Convert to standard units
  const quoteAmount = parseFloat(order.quoteAmount) / 1e6; // Convert to standard units

  const baseUsdPrice = getUsdPriceForToken(order.baseAsset) || 0;
  const quoteUsdPrice = getUsdPriceForToken(order.quoteAsset) || 0;

  const baseValueInUsd = baseAmount * baseUsdPrice;
  const quoteValueInUsd = quoteAmount * quoteUsdPrice;

  return +(baseValueInUsd + quoteValueInUsd).toFixed(6); // Total value in USD
}

export const calculateCorrectAmount = (
  amount: string | number,
  asset: string
): string => {
  // Define precision mapping for each asset
  const precisionMap: Record<string, number> = {
    btc: 1e8,       // Bitcoin precision
    usdc: 1e6,      // USD Coin precision
    arbusdc: 1e6,   // Arbitrum USD Coin precision
    solusdc: 1e6,   // Solana USD Coin precision
    arbeth: 1e18,   // Arbitrum Ethereum precision
    usdt: 1e6,      // Tether precision
    eth: 1e18,      // Ethereum precision
    sol: 1e9,       // Solana precision
    EPJ: 1e6,       // Paxos Standard precision
    dot: 1e10,      // Polkadot precision
    flip: 1e18,     // Chainflip token precision
  };

  // Get the precision for the given asset; default to 1e18 if not found
  const precision = precisionMap[asset.toLowerCase()] || 1e18;

  // Parse the amount and divide by precision
  const correctedAmount = parseFloat(amount.toString()) / precision;

  // Return the formatted value without unnecessary trailing zeros
  return parseFloat(correctedAmount.toFixed(18)).toString();
};

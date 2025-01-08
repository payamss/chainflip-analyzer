import { fetchTokenPricesFromAPI } from "@/app/services/tokenPriceService";


type TokenPrice = {
  chainId: string;
  address: string;
  usdPrice: number;
};


export default async function getAllTokenPrices() {
  const tokenPrices: TokenPrice[] = await fetchTokenPricesFromAPI();
  const tokenMap: { [key: string]: { address: string; chainId: string } } = {
    BTC: { address: "0x0000000000000000000000000000000000000000", chainId: "btc" },
    Usdc: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", chainId: "evm-1" },
    ArbUsdc: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", chainId: "evm-42161" },
    ArbEth: { address: "0x0000000000000000000000000000000000000000", chainId: "evm-42161" },
    USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", chainId: "evm-1" },
    ETH: { address: "0x0000000000000000000000000000000000000000", chainId: "evm-1" },
    SOL: { address: "0x0000000000000000000000000000000000000000", chainId: "sol" },
    SolUsdc: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", chainId: "sol" },
    DOT: { address: "0x0000000000000000000000000000000000000000", chainId: "dot" },
    Flip: { address: "0x826180541412D574cf1336d22c0C0a287822678A", chainId: "evm-1" },
  };
  
  const result: { [key: string]: number } = {};

  for (const [token, { address, chainId }] of Object.entries(tokenMap)) {
    const price = tokenPrices.find(tp => tp.address === address && tp.chainId === chainId);
    if (price) {
      result[token.toLowerCase()] = price.usdPrice;
    }
  }

  return result;
}


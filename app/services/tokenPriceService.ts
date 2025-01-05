/* eslint-disable @typescript-eslint/no-explicit-any */
const TOKEN_PRICE_ENDPOINT = "https://cache-service.chainflip.io/graphql";

/**
 * Fetch token prices from the GraphQL endpoint using `fetch`.
 * @param tokens Array of tokens with `chainId` and `address`.
 * @returns A Promise with the fetched token prices or an error.
 */
export const fetchTokenPrices = async (): Promise<any> => {
  const tokens = [
            {
                "chainId": "evm-1",
                "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            },
            {
                "chainId": "evm-1",
                "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
            },
            {
                "chainId": "evm-1",
                "address": "0x826180541412D574cf1336d22c0C0a287822678A"
            },
            {
                "chainId": "dot",
                "address": "0x0000000000000000000000000000000000000000"
            },
            {
                "chainId": "evm-1",
                "address": "0x0000000000000000000000000000000000000000"
            },
            {
                "chainId": "btc",
                "address": "0x0000000000000000000000000000000000000000"
            },
            {
                "chainId": "evm-42161",
                "address": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
            },
            {
                "chainId": "evm-42161",
                "address": "0x0000000000000000000000000000000000000000"
            },
            {
                "chainId": "sol",
                "address": "0x0000000000000000000000000000000000000000"
            },
            {
                "chainId": "sol",
                "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            }
        ];
  const query = `
    query GetTokenPrices($tokens: [PriceQueryInput!]!) {
      tokenPrices: getTokenPrices(input: $tokens) {
        chainId
        address
        usdPrice
      }
    }
  `;

  const body = JSON.stringify({
    query,
    variables: { tokens },
  });

  try {
    const response = await fetch(TOKEN_PRICE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      throw new Error(`Failed to fetch token prices: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error("Failed to fetch token prices.");
    }

    return result.data.tokenPrices; // Return the token prices
  } catch (error) {
    console.error("Error fetching token prices:", error);
    throw error;
  }
};

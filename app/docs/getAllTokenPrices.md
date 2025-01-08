# getAllTokenPrices Documentation

This document describes how the `getAllTokenPrices` function retrieves and constructs a mapping of token symbols to their **USD prices**. The function leverages an external service to fetch real-time price data for multiple blockchains and tokens.

[Token Prices](../../utils/tokenPrice.ts): The logic for fetching and mapping token prices.

---

## Core Responsibilities

1. **Fetch Prices**: Retrieves an array of token prices from an external API.  
2. **Map Tokens**: Maintains a static map (`tokenMap`) linking **symbol** \(\rightarrow\) `(address, chainId)`.  
3. **Assemble Final Data**: Constructs a result object containing **symbol** \(\rightarrow\) `usdPrice`.  

---

## 2. Step-by-Step Logic

1. **Fetching Token Prices**  

   ```ts
   const tokenPrices: TokenPrice[] = await fetchTokenPricesFromAPI();
   ```

   - This call returns an array of objects, each describing a token’s `chainId`, `address`, and `usdPrice`.  
   - Example of one `TokenPrice` object:
     \[
       \{ \text{chainId: "evm-1"}, \text{address: "0xA0b8..."}, \text{usdPrice: 1.00} \}
     \]

2. **Defining a Token Map**  

   ```ts
   const tokenMap: { [key: string]: { address: string; chainId: string } } = {
     BTC:   { address: "0x0000000000000000000000000000000000000000", chainId: "btc" },
     Usdc:  { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", chainId: "evm-1" },
     ...
   };
   ```

   - This `tokenMap` is effectively a **dictionary** of tokens and the specific `(address, chainId)` pairs used to identify them.  
   - **Note**: Some tokens (e.g., BTC, ETH) may use placeholder addresses if they are not EVM-based.

3. **Result Object Initialization**  

   ```ts
   const result: { [key: string]: number } = {};
   ```

   - Initializes an empty object that will eventually contain token names in **lowercase** mapped to their numeric USD prices.

4. **Populating the Result**  

   ```ts
   for (const [token, { address, chainId }] of Object.entries(tokenMap)) {
     const price = tokenPrices.find(tp => tp.address === address && tp.chainId === chainId);
     if (price) {
       result[token.toLowerCase()] = price.usdPrice;
     }
   }
   ```

   - **Iterate** over each entry in `tokenMap`.  
   - **Locate** the matching token in the fetched `tokenPrices` array by **comparing** address and chain ID.  
   - **Store** the `usdPrice` in the `result` object if found:
     \[
     \text{result}[ \text{token.toLowerCase()} ] = \text{price.usdPrice}
     \]
   - Tokens that are **not** found in `tokenPrices` are simply **skipped**, preventing undefined values.

5. **Returning the Final Object**  

   ```ts
   return result;
   ```

   - The function returns a dictionary with **key** = `token.toLowerCase()` and **value** = `usdPrice`.

---

## 3. Example Usage

Suppose `fetchTokenPricesFromAPI()` returns the following simplified data:

| chainId     | address                                      | usdPrice |
| ----------- | -------------------------------------------- | -------- |
| `evm-1`     | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | 1.00     |
| `btc`       | `0x0000000000000000000000000000000000000000` | 100000   |
| `evm-42161` | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` | 0.9995   |

1. **Token Map Entry**: `Usdc` → `(0xA0b8..., evm-1)`  
   - Matches the second row above (`evm-1 / 0xA0b8...`), so we assign:
     \[
       \text{result}[\text{"usdc"}] = 1.00
     \]

2. **Token Map Entry**: `BTC` → `(0x000...000, btc)`  
   - Matches the first row above (`btc / 0x000...000`), so we assign:
     \[
       \text{result}[\text{"btc"}] = 100000
     \]

3. **Token Map Entry**: `ArbUsdc` → `(0xaf88..., evm-42161)`  
   - Matches the third row, so we assign:
     \[
       \text{result}[\text{"arbusdc"}] = 0.9995
     \]

Finally, the `result` object might look like:

```json
{
  "btc": 100000,
  "usdc": 1.00,
  "arbusdc": 0.9995,
  ...
}
```

---

## 4. Common Use Cases

1. **Price Lookups**:  
   - **Other functions** in your codebase can call `getAllTokenPrices()` to quickly get a dictionary of the latest token prices in USD.  
   - This allows further calculations (e.g., converting user balances to USD, computing total portfolio value).

2. **Token Validation**:  
   - If a token symbol is **missing** from the resulting dictionary, that implies it either **wasn’t** in `tokenMap` or **wasn’t** returned by the API.

3. **Error Handling**:  
   - If `fetchTokenPricesFromAPI()` fails or returns an empty array, the final `result` object will simply be empty.  
   - Downstream code should be prepared to handle missing token prices.

---

## 5. Notes & Extensions

- **Chain ID / Address Uniqueness**: Each token is identified by a combination of its **chainId** and **address**. For tokens like **BTC** and **ETH** (non-EVM-based or using placeholder addresses), the chain ID is crucial.
  
- **Adding New Tokens**:  
  - To **support** a new token, add a new entry in `tokenMap`.  
  - Ensure the **address** and **chainId** match the API’s data.  

- **Multiple Price Feeds**:  
  - If multiple sources provide token data, one might merge or pick the most **recent** or **accurate** feed.  
  - `fetchTokenPricesFromAPI()` can be extended to handle fallback logic if one source is unavailable.

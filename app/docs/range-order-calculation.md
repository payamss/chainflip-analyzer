# Metrics Calculation Documentation

This document explains the **mathematical logic** behind several key calculations used to process and display order data. Metrics covered include the number of days an order has been open (duration), fees earned, **Daily Percentage Rate (DPR)**, **Monthly Percentage Rate (MPR)**, and **Annual Percentage Rate (APR)**. The document also outlines how different token amounts are converted into standard units (e.g., USDC, ETH) and how various filters (such as status) are applied to orders.

[Metrics Calculator](../../utils/calculateMetrics.ts): The logic of range order

---

## 1. Duration

**Definition**: The **duration** measures how many days have passed between two timestamps (e.g., order creation time and last update time).

- **Formula**:  
  \[
  \text{Duration (days)} = \left\lceil \dfrac{\text{Days Passed}}{1000 \times 60 \times 60 \times 24} \right\rceil
  \]  
- **Result**: If the calculation yields a negative value, it is set to **0** to avoid invalid durations.

**Usage**:

- **For Open Orders**:
  - If the order is still active ( **open** order), the `endTimestamp` corresponds to the **current date and time**.
  - Formula:
    \[
    \text{Days Passed} = \text{Current Date} - \text{Created Date}
    \]

- **For Closed Orders**:
  - If the order is completed (**closed** order), the `endTimestamp` corresponds to the **closed date and time**.
  - Formula:
    \[
    \text{Days Passed} = \text{Closed Date} - \text{Created Date}
    \]

---

## 2. Earned Fees

**Definition**: Many orders collect fees in different tokens (e.g., USDC, USDT, ETH). To simplify calculations, fees are converted to USD and summed.

1. **Parsing**:  
   - The code extracts string-based numeric fees, e.g., `"1.338906"` → \(1.338906\).
   - If any string is invalid or empty, it defaults to **0**.
   - collected Fees in USD available in API call

2. **Summation**:  
   \[
   \text{Total Fees} = \text{quoteCollectedFeesInUsd} + \text{baseCollectedFeesInUsd}
   \]
   The result is typically rounded to 6 decimal places for precision.

---

## 3. Order Value

**Definition**: The total USD value of an order based on the amounts of **base** and **quote** assets.

1. **Convert Raw Amount**:  
   Each asset (e.g., BTC, ETH, USDC) has a **precision** (number of decimal places) that must be accounted for. For example, 1 BTC might be stored internally as \(100{,}000{,}000\) (satoshis).

   \[
   \text{Corrected Amount} = \dfrac{\text{Raw Amount}}{\text{Precision}}
   \]

2. **Lookup USD Price**:  
   Retrieve each asset’s USD price from a price map or an external API.

3. **Compute Order Value**:  
   \[
   \text{Order Value} = \bigl(\text{Base Amount} \times \text{Base USD Price}\bigr) \;+\;\bigl(\text{Quote Amount} \times \text{Quote USD Price}\bigr)
   \]

---

## 4. Daily Percentage Rate (DPR)

**Definition**: The **Daily Percentage Rate** indicates the **daily return** (in %) for an order, based on the total fees earned and its total value over the duration.

1. **Inputs**:
   - \(F_{\text{total}}\): Total fees in USD.
   - \(V_{\text{order}}\): Order value in USD.
   - \(d\): Duration (days).

2. **Formula**:
   \[
   \text{DPR} = \left(\dfrac{F_{\text{total}}}{V_{\text{order}} \times d}\right) \times 100
   \]

3. **Bounds**:
   - If \(F_{\text{total}} \le 0\), \(V_{\text{order}} \le 0\), or \(d \le 0\), the DPR is **0**.

---

## 5. Monthly Percentage Rate (MPR)

**Definition**: The **Monthly Percentage Rate** is a simple extrapolation of the DPR to a 30-day period.

- **Formula**:  
  \[
  \text{MPR} = \text{DPR} \times 30
  \]
  
- **Example**: A DPR of \(0.20\%\) implies an MPR of \(6.00\%\).

---

## 6. Annual Percentage Rate (APR)

**Definition**: The **Annual Percentage Rate** extrapolates the DPR to a 365-day period.

- **Formula**:  
  \[
  \text{APR} = \text{DPR} \times 365
  \]

- **Example**: A DPR of \(0.20\%\) implies an APR of \(73.00\%\).

---

## 7. Example Calculation

Suppose an **open** order has the following data:

| **Metric**        | **Value**          |
| ----------------- | ------------------ |
| **Earned Fees**   | $2.00 (total USDC) |
| **Order Value**   | $500               |
| **Creation Date** | 12/25/2024         |
| **Today’s Date**  | 01/02/2025         |

**Step 1. Duration**  
\[
\text{Duration} = 01/02/2025 - 12/25/2024 = 8 \text{ days}
\]

**Step 2. DPR**  
\[
\text{DPR} = \left(\dfrac{2.00}{500 \times 8}\right) \times 100 \approx 0.05\%
\]

**Step 3. MPR**  
\[
\text{MPR} = 0.05 \times 30 = 1.50\%
\]

**Step 4. APR**  
\[
\text{APR} = 0.05 \times 365 \approx 18.25\%
\]

---

## 8. Order Filtering and Sorting

1. **Status Filter**:  
   Orders can be **OPEN**, **CLOSED**, or **ALL**. Only orders whose status matches the chosen filter appear in the results.

2. **Sorting**:  
   You can sort by different columns (e.g., DPR, APR, Duration) in ascending or descending order.

---

## 9. Price Fetching and Token Precision

1. **Token Prices**:  
   - A background service (e.g., `fetchTokenPricesFromAPI`) retrieves token prices in USD.
   - A **token map** associates each known token (BTC, ETH, SOL, etc.) with its unique address and chain ID.

2. **Precision Map**:  
   Each token has its own decimal precision:
   - BTC: \(10^8\)  
   - ETH: \(10^{18}\)  
   - USDC: \(10^6\)  
   - etc.  

   When reading amounts, the code **divides** by the corresponding precision so that all amounts are converted to a **standard** decimal format.

---

## 10. Updated Table Columns

The Range Orders table now includes the following columns:

| Status | ID        | Assets / Amount          | Value    | Range             | Earned Fees | Duration | DPR   | MPR  | APR   | Account Link |
| ------ | --------- | ------------------------ | -------- | ----------------- | ----------- | -------- | ----- | ---- | ----- | ------------ |
| OPEN   | cFK...Juv | 1765.454986 / 112.823891 | $1877.40 | 0.99980 ↔ 1.00481 | $0.714676   | 1 days   | 0.04% | 1.2% | 14.6% | View         |
| OPEN   | cFM...RbE | 0 / 24.135637            | $24.12   | 0.99960 ↔ 1.00040 | $0.000000   | 2 days   | 0%    | 0%   | 0%    | View         |
| CLOSED | cFL...5Yq | 976.554971 / 651.42743   | $1934.97 | 0.00000 ↔ 0.00000 | $1.384352   | 3 days   | 0.02% | 0.6% | 7.3%  | View         |

(Only a subset of rows shown for clarity.)

## 11. New Features

1. **Filtering by Status**:  
   Allows users to view only **OPEN**, only **CLOSED**, or **ALL** orders.

2. **Pagination**:  
   The table can split results into pages (e.g., 15 orders per page).

3. **Asset Icon Loading**:  
   The system can dynamically load icons for tokens and chains to visually identify the assets in each order.

4. **Error Handling**:  
   If data cannot be fetched or parsed, user-friendly error messages are displayed.

---

## Notes

- **Precision**: Floating-point arithmetic can introduce rounding errors. Values are typically truncated or rounded to a specified number of decimal places for readability.
- **Zero Values**: For invalid inputs (e.g., negative duration, zero or negative fees), the calculations **default** to zero to avoid returning nonsensical rates.
- **Extension**: These formulas can be adapted to other financial calculations, such as compounding, by adjusting the formula for DPR, MPR, and APR as needed.

---

**End of Documentation**

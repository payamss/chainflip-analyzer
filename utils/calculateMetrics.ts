/**
 * Calculates the number of days passed since the order was created.
 */
export function calculateDaysPassed(createdDate: string): number {
  const created = new Date(createdDate); // Parse ISO 8601 date string
  const now = new Date();
  const diffTime = now.getTime() - created.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  return days > 0 ? days : 0; // Ensure non-negative value
}

/**
 * Sums earned fees from `quoteCollectedFeesUsd` and `baseCollectedFeesUsd`.
 */
export function calculateTotalFees(order: { quoteCollectedFeesUsd: string; baseCollectedFeesUsd: string }): number {
  const quoteFees = parseFloat(order.quoteCollectedFeesUsd) || 0;
  const baseFees = parseFloat(order.baseCollectedFeesUsd) || 0;

  return parseFloat((quoteFees + baseFees).toFixed(6)); // Sum and ensure precision
}

/**
 * Calculates Daily Percentage Rate (DPR).
 */
export function calculateDPR(totalFees: number, orderValue: number, daysPassed: number): number {
  if (totalFees <= 0 || orderValue <= 0 || daysPassed <= 0) {
    return 0; // Handle invalid inputs
  }

  const dpr = (totalFees / (orderValue * daysPassed)) * 100;
  return parseFloat(dpr.toFixed(2)); // Return percentage with 2 decimal places
}

/**
 * Calculates Monthly Percentage Rate (MPR) based on DPR.
 */
export function calculateMPR(dpr: number): number {
  return parseFloat((dpr * 30).toFixed(2)); // Scale DPR to monthly
}

/**
 * Calculates Annual Percentage Rate (APR) based on DPR.
 */
export function calculateAPR(dpr: number): number {
  return parseFloat((dpr * 365).toFixed(2)); // Scale DPR to yearly
}

export const calculatePriceFromTick = (tick: number): number => {
  return Math.pow(1.0001, tick);
};
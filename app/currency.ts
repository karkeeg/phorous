// Demo-only conversion: product prices are authored as a base unit value and
// displayed to shoppers in Nepali Rupees. No real payment ever uses this rate.
export const USD_TO_NPR_RATE = 133;

export function toNPR(baseAmount: number): number {
  return Math.round(baseAmount * USD_TO_NPR_RATE);
}

export function formatNPR(baseAmount: number): string {
  return `Rs ${toNPR(baseAmount).toLocaleString('en-IN')}`;
}

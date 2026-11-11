// Formatting utilities for Richard Rental Marketplace

export const USD_TO_UGX_RATE = 3700;

export function formatUGX(amount: number): string {
  if (isNaN(amount)) return 'UGX 0';
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatUSD(ugxAmount: number): string {
  const usd = Math.round(ugxAmount / USD_TO_UGX_RATE);
  return `≈ $${usd.toLocaleString('en-US')}`;
}

export function formatCurrencyByCountry(
  ugxAmount: number,
  currencyCode: string,
  rateToUGX: number = 1
): string {
  if (currencyCode === 'UGX') {
    return formatUGX(ugxAmount);
  }
  const converted = Math.round(ugxAmount / rateToUGX);
  return `${currencyCode} ${converted.toLocaleString('en-US')}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString;
  }
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export function generateBookingRef(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `UG-BK-2026-${randomNum}`;
}

export function generateOfferId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `OF-2026-${randomNum}`;
}

export function generatePropertyId(prefix = 'UG', district = 'KLA'): string {
  const randomSeq = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${district.toUpperCase().slice(0, 3)}-P-${randomSeq}`;
}

export function generateLandlordId(prefix = 'UG'): string {
  const randomSeq = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-L-${randomSeq}`;
}

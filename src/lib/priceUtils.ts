/**
 * Utility functions for price display and masking
 */

/**
 * Converts a price string to a numeric value for comparison
 * Handles both hourly prices (€150/h) and total prices (€1.450)
 * For hourly prices, estimates total price by assuming 1-hour session
 * @param priceString - Price string like "€150/h" or "€1.450"
 * @returns Numeric value of the price
 */
export const parsePrice = (priceString: string): number => {
  // Remove currency symbols and extract numeric value
  const cleanPrice = priceString.replace(/[€,$]/g, '');
  
  // Handle different price formats
  if (priceString.includes('/h')) {
    // Hourly price - treat as total for 1 hour session
    const numericValue = parseFloat(cleanPrice);
    return isNaN(numericValue) ? 0 : numericValue;
  } else {
    // Total price - remove dots (thousands separator in Italian format)
    const numericValue = parseFloat(cleanPrice.replace(/\./g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  }
};

/**
 * Formats price for display without "/h" suffix
 * @param priceString - Original price string like "€150/h" or "€1.450"
 * @returns Formatted price string without "/h"
 */
export const formatPriceForDisplay = (priceString: string): string => {
  return priceString.replace('/h', '');
};

/**
 * Converts a numeric price to dollar symbols based on price ranges
 * @param price - Numeric price value
 * @returns String with appropriate number of $ symbols
 */
export const getPriceSymbols = (price: number): string => {
  if (price <= 100) return '$';
  if (price <= 500) return '$$';
  if (price <= 1000) return '$$$';
  if (price <= 3000) return '$$$$';
  return '$$$$$'; // For prices above 3000
};

/**
 * Masks a price string with dollar symbols for non-authenticated users
 * @param priceString - Original price string like "€150/h"
 * @returns Masked price string with $ symbols
 */
export const maskPrice = (priceString: string): string => {
  const numericPrice = parsePrice(priceString);
  return getPriceSymbols(numericPrice);
};

/**
 * Formats price display based on authentication status
 * @param priceString - Original price string
 * @param isAuthenticated - Whether user is logged in
 * @returns Either the original price (without /h) or masked symbols
 */
export const formatPriceDisplay = (priceString: string, isAuthenticated: boolean): string => {
  return isAuthenticated ? formatPriceForDisplay(priceString) : maskPrice(priceString);
};

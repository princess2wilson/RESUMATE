// Currency formatting utilities
export function formatPrice(amount: number, currency = 'USD') {
  const userLocale = navigator.language || 'en-US';

  try {
    return new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: userLocale.startsWith('en-GB') ? 'GBP' : currency, // Use GBP for UK users
      currencyDisplay: 'symbol',
    }).format(amount / 100);
  } catch (error) {
    // Fallback to basic USD formatting if Intl.NumberFormat fails
    return `$${(amount / 100).toFixed(2)}`;
  }
}

// Calculate discounted price (used in multiple components)
export function calculateDiscountedPrice(price: number, discountPercentage = 50) {
  return Math.floor(price * (1 - discountPercentage / 100));
}
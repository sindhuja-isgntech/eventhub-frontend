const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export const formatCurrency = (amount: number): string => inrFormatter.format(amount);

export const formatIndianDateTime = (
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {},
): string => {
  const date = value instanceof Date
    ? value
    : /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
      ? new Date(value)
      : new Date(value.includes('T') ? `${value}+05:30` : `${value}T00:00:00+05:30`);

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    ...options,
  }).format(date);
};

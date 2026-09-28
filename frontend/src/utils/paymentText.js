// Format system payment labels without changing stored records or payment mode.
export function paymentText(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/^Demo payment\b/i, 'Payment')
    .replace(/^PayHere Demo\b/i, 'PayHere');
}

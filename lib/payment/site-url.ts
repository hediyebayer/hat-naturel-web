export function getSiteBaseUrl(): string {
  return (
    process.env.SITE_URL
    ?? process.env.NEXT_PUBLIC_SITE_URL
    ?? process.env.NEXT_PUBLIC_BASE_URL
    ?? 'http://localhost:3001'
  ).replace(/\/$/, '');
}

export function getPaymentCallbackUrl(): string {
  return `${getSiteBaseUrl()}/api/payment/callback`;
}

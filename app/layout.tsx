import type { Metadata } from 'next';
import './globals.css';

// Root layout: locale layout html/body sağlıyor, burada sadece children pass.
export const metadata: Metadata = {
  title: 'Hat Naturel Resort Sapanca',
  description: 'Sapanca\'da doğayla iç içe, premium bungalov tatil deneyimi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return children as React.ReactElement;
}

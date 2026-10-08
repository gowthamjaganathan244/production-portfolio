import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { profile } from '@/data/portfolio';
import { siteOrigin } from '@/lib/site';
import './globals.css';
const display = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/chakra-petch/files/chakra-petch-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/chakra-petch/files/chakra-petch-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});
// Reserve preload priority for the hero's 300/600 weights; 500 loads on demand.
const displayMedium = localFont({
  src: '../../node_modules/@fontsource/chakra-petch/files/chakra-petch-latin-500-normal.woff2',
  weight: '500',
  variable: '--font-display-medium',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  preload: false,
});
const body = localFont({
  src: '../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2',
  variable: '--font-body',
  display: 'swap',
  weight: '400 700',
  fallback: ['Arial', 'sans-serif'],
});
const mono = localFont({
  src: '../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-mono',
  display: 'swap',
  fallback: ['Courier New', 'monospace'],
  preload: true,
});
const origin = siteOrigin();
export const metadata: Metadata = {
  title: 'Gowtham Jaganathan | Cloud & Software Engineer',
  description: profile.description,
  applicationName: 'Gowtham Jaganathan Portfolio',
  ...(origin ? { metadataBase: new URL(origin), alternates: { canonical: '/' } } : {}),
  openGraph: {
    title: 'Gowtham Jaganathan | Cloud & Software Engineer',
    description: profile.description,
    type: 'website',
    locale: 'en_AU',
    ...(origin ? { url: origin } : {}),
  },
  twitter: {
    card: 'summary',
    title: 'Gowtham Jaganathan | Cloud & Software Engineer',
    description: profile.description,
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0813',
  colorScheme: 'dark',
  viewportFit: 'cover',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${display.variable} ${displayMedium.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

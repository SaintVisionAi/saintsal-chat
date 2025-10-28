/* app/layout.tsx - Root layout for SaintSal Chat */
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'SaintSal™ - IQ 157 Intelligence Platform',
  description: 'SaintSal™ — Responsible Intelligence - Cookin\' Knowledge. IQ 157 Intelligence Platform with multi-model AI, voice integration, and enterprise tools.',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://files.catbox.moe/c0zaok.png',
    shortcut: 'https://files.catbox.moe/c0zaok.png',
    apple: 'https://files.catbox.moe/c0zaok.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SaintSal™',
  },
  openGraph: {
    title: 'SaintSal™ - IQ 157 Intelligence Platform',
    description: 'Responsible Intelligence - Cookin\' Knowledge. AI platform with multi-model intelligence, real-time streaming, and voice integration.',
    images: ['https://files.catbox.moe/c0zaok.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaintSal™ - IQ 157 Intelligence Platform',
    description: 'Responsible Intelligence - Cookin\' Knowledge',
    images: ['https://files.catbox.moe/c0zaok.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#FFD54A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SaintSal™" />
        <link rel="manifest" href="/manifest.json" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                      console.log('SW registered:', registration);
                    },
                    (err) => {
                      console.log('SW registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

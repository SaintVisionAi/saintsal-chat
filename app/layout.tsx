/* app/layout.tsx - Root layout for SaintSal Chat */
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'SaintSal™ - IQ 157 Intelligence Platform',
  description: 'SaintSal™ — IQ 157 Intelligence Platform with multi-model AI, voice integration, and enterprise tools',
  icons: {
    icon: 'https://files.catbox.moe/c0zaok.png',
    shortcut: 'https://files.catbox.moe/c0zaok.png',
    apple: 'https://files.catbox.moe/c0zaok.png',
  },
  openGraph: {
    title: 'SaintSal™ - IQ 157 Intelligence Platform',
    description: 'AI platform with multi-model intelligence, real-time streaming, voice integration, and enterprise-grade security',
    images: ['https://files.catbox.moe/c0zaok.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaintSal™ - IQ 157 Intelligence Platform',
    description: 'Multi-Model AI Intelligence Platform',
    images: ['https://files.catbox.moe/c0zaok.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

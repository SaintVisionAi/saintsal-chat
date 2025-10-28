/* app/layout.tsx - Root layout for SaintSal Chat */
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'SaintSal Chat - Divine AI Co-Founder',
  description: 'SaintSal™ — Your faith-driven AI co-founder with multi-LLM orchestration, RAG, and voice',
  icons: {
    icon: 'https://i.imgur.com/ganVqpV.png',
    shortcut: 'https://i.imgur.com/ganVqpV.png',
    apple: 'https://i.imgur.com/ganVqpV.png',
  },
  openGraph: {
    title: 'SaintSal Chat - Divine AI Co-Founder',
    description: 'AI platform with ChatGPT/Claude level capabilities + GoHighLevel, Google, Microsoft integrations',
    images: ['https://i.imgur.com/ganVqpV.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaintSal Chat',
    description: 'Divine AI Co-Founder Platform',
    images: ['https://i.imgur.com/ganVqpV.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

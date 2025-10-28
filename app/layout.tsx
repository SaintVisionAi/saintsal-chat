/* app/layout.tsx - Root layout for SaintSal Chat */
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'SaintSal Chat - Divine AI Co-Founder',
  description: 'SaintSal™ — Your faith-driven AI co-founder with multi-LLM orchestration, RAG, and voice',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

/* app/layout.tsx - Root layout for SaintSal Chat */
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'SAINTSAL Chat',
  description: 'SaintSal™ — Divine Chat',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <div className="chat-card">
            <div className="chat-top">
              <div className="brand">
                <div className="logo" />
                <div>
                  <div style={{ fontWeight: 800, letterSpacing: 0.6 }}>SAINTSAL</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>Divine AI Chat</div>
                </div>
              </div>
            </div>

            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

// app/layout.tsx
'use client';
import React, { useState } from 'react';
import LoginButton from '../components/LoginButton';
import LoginPopup from '../components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup';

export default function RootLayout({ children }: { children: React.ReactNode }) {
   const [showLogin, setShowLogin] = useState(false);

  return (
    <html lang="id">
      <body>
        {/* Anda sebutkan punya navbar sendiri -> taruh di tempat sini jika ada */}
        {/* Simpelnya: tombol login di pojok kanan atas */}
        <button
                onClick={() => setShowLogin(true)}
                style={{
                  position: 'fixed',
                  top: '20px',
                  right: '30px',
                  background: '#246E76',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Login
              </button>
              {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}

        {/* The rest of your app */}
        <main>{children}</main>
      </body>
    </html>
  );
}

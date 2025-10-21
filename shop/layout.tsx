// app/layout.tsx
'use client';
import React, { useState } from 'react';
import LoginButton from '../components/LoginButton';
import LoginPopup from '../components/LoginPopup';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<'card' | 'modal'>('card');

  return (
    <html lang="id">
      <body>
        {/* Anda sebutkan punya navbar sendiri -> taruh di tempat sini jika ada */}
        {/* Simpelnya: tombol login di pojok kanan atas */}
        <LoginButton onOpen={() => setOpen(true)} />

       

     
        <LoginPopup open={open} onClose={() => setOpen(false)} variant={variant} />

        {/* The rest of your app */}
        <main>{children}</main>
      </body>
    </html>
  );
}

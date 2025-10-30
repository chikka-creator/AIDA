// src/app/components/HomeClient.tsx
'use client';

import React, { useState } from 'react';
import LoginButton from '../components/LoginButton';
import LoginPopup from '../components/LoginPopup';

export default function HomeClient() {
  const [showLogin, setShowLogin] = useState(false);
  // default variant bisa diubah: 'card' | 'modal'

  return (
    <>
      {/* Tombol Login di kanan atas */}
      <LoginButton onOpen={() => setShowLogin(true)} />

      {/* Popup Login */}
      <LoginPopup open={showLogin} onClose={() => setShowLogin(false)}/>
    </>
  );
}

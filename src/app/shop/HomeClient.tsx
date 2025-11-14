// src/app/shop/HomeClient.tsx
'use client';

import { useState } from 'react';
import AuthButton from '../components/AuthButton';
import LoginPopup from '../components/LoginPopup';

export default function HomeClient() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* Auth Button (shows Login or User Menu based on session) */}
      <AuthButton />

      {/* Optional: If you want a separate login popup trigger */}
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </>
  );
}
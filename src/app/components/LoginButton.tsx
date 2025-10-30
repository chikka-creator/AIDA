'use client';
import React, { useState } from 'react';
import LoginPopup from './LoginPopup';
import "./popup.css";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className='btn-login'
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
    </>
  );
}

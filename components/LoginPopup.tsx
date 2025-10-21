'use client';

import React from 'react';
import './LoginPopup.css';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';

interface LoginPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginPopup({ open, onClose }: LoginPopupProps) {
  if (!open) return null;

  return (
    <div className="loginPopupOverlay show" onClick={onClose}>
      <div
        className="loginPopupCard"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close */}
        <button className="closeBtn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Logo kecil di pojok kanan atas */}
        <img
          src="/aida-star.png"
          alt="AIDA small"
          className="logoSmall"
        />

        {/* Kolom kiri (logo besar) */}
        <div className="leftPanel">
          <img
            src="/aida-star.png"
            alt="AIDA large"
            className="logoLarge"
          />
        </div>

        {/* Kolom kanan (form login) */}
        <div className="rightPanel">
          <h2 className="loginTitle">User Login</h2>

          <input type="text" placeholder="Username" className="loginInput" />
          <input type="password" placeholder="Password" className="loginInput" />

          <button className="loginBtn">Login</button>

          <div className="divider"></div>

          <button className="authBtn googleBtn" onClick={() => signIn('google')}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={18}
              height={18}
            />
            Sign up with Google
          </button>

          <button className="authBtn appleBtn" onClick={() => signIn('apple')}>
            <img
              src="/apple.png"
              alt="Apple"
              width={18}
              height={18}
            />
            Sign up with Apple
          </button>

          <div className="createAccount">
            <a href="#">Create Your Account →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

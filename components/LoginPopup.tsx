'use client';
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import RegisterPopup from './RegisterPopup';
import './popup.css';

interface LoginPopupProps {
  onClose: () => void;
}

export default function LoginPopup({ onClose }: LoginPopupProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.username || !formData.password)
      return setError('Please fill in all fields.');
    if (formData.password.length < 8)
      return setError('Password must be at least 8 characters long.');
    alert('Login success (mock)');
  };

  // Fade-out animation handler
  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  // Click outside handler
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const card = document.querySelector('.popupCard');
      if (card && !card.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (showRegister)
    return <RegisterPopup onBack={() => setShowRegister(false)} onClose={onClose} />;

  return (
    <div className={`popupOverlay ${closing ? 'closing' : ''}`}>
      <div className="popupCard">
        <div className="popupLeft">
          <img src="/aida-star.png" alt="Logo" className="popupLogoLarge" />
        </div>

        <div className="popupRight">
          <img src="/aida-star.png" alt="Logo" className="popupLogoSmall" onClick={handleClose} />

          <h2 className="popupTitle">Login</h2>

          <form onSubmit={handleLogin} className="popupForm">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="popupInput"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="popupInput"
            />
            {error && <p className="popupError">{error}</p>}
            <button type="submit" className="popupBtnMain">Login</button>

            <div className="popupDivider"></div>

            <button
              type="button"
              className="popupBtnGoogle"
              onClick={() => signIn('google')}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" 
              width={'18px'}
              
              />
              Sign in with Google
            </button>

            <button
              type="button"
              className="popupBtnApple"
              onClick={() => signIn('apple')}
            >
              <img src="/apple.png" alt="Apple"
              width={'18px'}
              
              />
              Sign in with Apple
            </button>
          </form>

          <p className="popupSwitchText" onClick={() => setShowRegister(true)}>
            Create Your Account →
          </p>
        </div>
      </div>
    </div>
  );
}

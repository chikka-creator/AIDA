'use client';
import React, { useState, useEffect } from 'react';
import './popup.css';

interface RegisterPopupProps {
  onBack: () => void;
  onClose: () => void;
}

export default function RegisterPopup({ onBack, onClose }: RegisterPopupProps) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.username || !formData.email || !formData.password)
      return setError('Please fill in all fields.');
    if (formData.password.length < 8)
      return setError('Password must be at least 8 characters long.');
    alert('Register success (mock)');
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

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

  return (
    <div className={`popupOverlay ${closing ? 'closing' : ''}`}>
      <div className="popupCard">
        <div className="popupLeft">
          <img src="/aida-star.png" alt="Logo" className="popupLogoLarge" />
        </div>

        <div className="popupRight">
          <img src="/aida-star.png" alt="Logo" className="popupLogoSmall" onClick={handleClose} />

          <h2 className="popupTitle">Sign Up</h2>

          <form onSubmit={handleRegister} className="popupForm">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="popupInput"
            />
            <input
              type="text"
              placeholder="Email / Whatsapp"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <button type="submit" className="popupBtnMain">Get Started</button>
          </form>

          <p className="popupSwitchText" onClick={onBack}>
            Already have an account? <span>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

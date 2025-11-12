'use client';
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './popup.css';

interface RegisterPopupProps {
  onBack: () => void;
  onClose: () => void;
}

export default function RegisterPopup({ onBack, onClose }: RegisterPopupProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    name: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto login after successful registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Registration successful but login failed. Please login manually.');
        setLoading(false);
        return;
      }

      // Success
      router.refresh();
      handleClose();
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
      setLoading(false);
    }
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
          <img src="/aida-star.webp" alt="Logo" className="popupLogoLarge" />
        </div>

        <div className="popupRight">
          <img 
            src="/aida-star.webp" 
            alt="Logo" 
            className="popupLogoSmall" 
            onClick={handleClose}
            style={{ cursor: 'pointer' }}
          />

          <h2 className="popupTitle">Sign Up</h2>

          <form onSubmit={handleRegister} className="popupForm">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="popupInput"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Full Name (optional)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="popupInput"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="popupInput"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password (min. 8 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="popupInput"
              disabled={loading}
            />
            {error && <p className="popupError">{error}</p>}
            <button 
              type="submit" 
              className="popupBtnMain"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <p 
            className="popupSwitchText" 
            onClick={() => !loading && onBack()}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            Already have an account? <span>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
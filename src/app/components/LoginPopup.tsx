'use client';
import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import RegisterPopup from './RegisterPopup';
import './popup.css';

interface LoginPopupProps {
  onClose: () => void;
}

export default function LoginPopup({ onClose }: LoginPopupProps) {
  const router = useRouter();
  const { update } = useSession();
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (result?.ok) {
        setSuccess('Login successful! Redirecting...');
        // Update the session state immediately
        setTimeout(() => {
          router.refresh();
          handleClose();
        }, 500);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
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

  if (showRegister)
    return <RegisterPopup onBack={() => setShowRegister(false)} onClose={onClose} />;

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

          <h2 className="popupTitle">Login</h2>

          <form onSubmit={handleLogin} className="popupForm">
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
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="popupInput"
              disabled={loading}
            />
            {error && <p className="popupError" style={{ color: '#d32f2f' }}>{error}</p>}
            {success && <p className="popupError" style={{ color: '#4caf50' }}>{success}</p>}
            <button 
              type="submit" 
              className="popupBtnMain"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="popupDivider"></div>

            <button
              type="button"
              className="popupBtnGoogle"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                width={'18px'}
              />
              Sign in with Google
            </button>
          </form>

          <p 
            className="popupSwitchText" 
            onClick={() => !loading && setShowRegister(true)}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            Create Your Account →
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Toast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const error = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl');

    if (error === 'OAuthAccountNotLinked') {
      setMessage('Account already exists with different provider');
      setType('error');
      setShow(true);
    } else if (callbackUrl && !error) {
      setMessage('Successfully logged in!');
      setType('success');
      setShow(true);
    }

    if (show) {
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: type === 'success' ? '#4caf50' : '#f44336',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease',
      }}
    >
      {message}
    </div>
  );
}
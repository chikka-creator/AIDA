'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export default function UserMenu() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) return null;

  return (
    <div 
      ref={menuRef}
      style={{
        position: 'fixed',
        top: '20px',
        right: '30px',
        zIndex: 200,
      }}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: '#246E76',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
      </button>

      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '55px',
            right: '0',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '10px',
            minWidth: '200px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <p style={{ margin: '0', color: '#333', fontWeight: 'bold' }}>
              {session.user?.name}
            </p>
            <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
              {session.user?.email}
            </p>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
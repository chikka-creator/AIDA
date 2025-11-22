'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import LoginPopup from './LoginPopup';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'CUSTOMER'>('CUSTOMER');
  const [loadingRole, setLoadingRole] = useState(true);

  // Fetch user role from database
  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/auth/check-role');
          const data = await response.json();
          if (data.role) {
            setUserRole(data.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        } finally {
          setLoadingRole(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchUserRole();
    }
  }, [session, status]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '30px',
          zIndex: 200,
        }}
      >
        <div
          style={{
            background: '#246E76',
            color: '#fff',
            borderRadius: '10px',
            padding: '10px 18px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          }}
        >
          {t.auth.loading}
        </div>
      </div>
    );
  }

  // If user is logged in, show user menu
  if (session?.user) {
    return (
      <div
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
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
        </button>

        {menuOpen && (
          <>
            {/* Backdrop to close menu */}
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'transparent',
                zIndex: 199,
              }}
            />

            {/* Dropdown menu */}
            <div
              style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                padding: '8px',
                minWidth: '240px',
                animation: 'fadeIn 0.2s ease',
                zIndex: 200,
              }}
            >
              {/* User Info */}
              <div style={{ 
                padding: '12px', 
                borderBottom: '1px solid #eee',
                marginBottom: '4px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}>
                  <p style={{ 
                    margin: '0', 
                    color: '#333', 
                    fontWeight: 'bold', 
                    fontSize: '15px',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: '8px'
                  }}>
                    {session.user.name || 'User'}
                  </p>
                  {!loadingRole && (
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: userRole === 'ADMIN' ? '#246E76' : '#e0e0e0',
                      color: userRole === 'ADMIN' ? 'white' : '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      flexShrink: 0
                    }}>
                      {userRole}
                    </span>
                  )}
                </div>
                <p style={{ 
                  margin: '0', 
                  color: '#666', 
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {session.user.email}
                </p>
              </div>

              {/* Navigation Links */}
              <button
                onClick={() => {
                  router.push('/owned-products');
                  setMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '18px' }}>📚</span>
                {t.auth.myLibrary}
              </button>

              <button
                onClick={() => {
                  router.push('/purchases');
                  setMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '18px' }}>🛒</span>
                {t.auth.purchaseHistory}
              </button>

              <div style={{ 
                height: '1px', 
                background: '#eee', 
                margin: '8px 0' 
              }} />

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  color: '#f44336',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffebee')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '18px' }}>🚪</span>
                {t.auth.signOut}
              </button>
            </div>
          </>
        )}

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // If not logged in, show login button
  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        className="btn-login"
        style={{
          position: 'fixed',
          top: '14px',
          right: '-65px',
          background: '#2fafbeff',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 18px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          cursor: 'pointer',
          zIndex: 200,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = '#2fafbeff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = '#2fafbeff';
        }}
      >
        {t.auth.login}
      </button>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </>
  );
}
// src/app/shop/CartModal.tsx
'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Product } from './page';
import './shop.css';

export default function Cart({
  onClose,
  items,
  onRemove,
}: {
  onClose: () => void;
  items: { p: Product; qty: number }[];
  onRemove: (id: string) => void;
}) {
  const { data: session } = useSession();
  const [closing, setClosing] = useState(false);
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'E_WALLET' | 'BANK_TRANSFER' | 'QR_CODE'>('E_WALLET');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [error, setError] = useState('');
  const [purchaseId, setPurchaseId] = useState('');

  const total = items.reduce((s, it) => s + it.qty * it.p.price, 0);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handlePayment = async () => {
    // Validate
    if (!session?.user) {
      setError('Please login to continue');
      return;
    }

    if (!username.trim() || !whatsapp.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }

    setError('');
    setPaymentStatus('processing');

    try {
      // Create purchase
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.p.id,
            quantity: item.qty,
          })),
          paymentMethod,
          username,
          whatsapp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create purchase');
      }

      setPurchaseId(data.purchase.id);

      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Complete the payment
          const completeResponse = await fetch(`/api/purchases/${data.purchase.id}/complete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transactionId: `TXN-${Date.now()}`,
              paymentProof: 'proof-url-here',
            }),
          });

          const completeData = await completeResponse.json();

          if (!completeResponse.ok) {
            throw new Error(completeData.error || 'Payment failed');
          }

          setPaymentStatus('success');
        } catch (err: any) {
          console.error('Payment completion error:', err);
          setPaymentStatus('failed');
          setError(err.message || 'Payment failed');
        }
      }, 2000);

    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentStatus('failed');
      setError(err.message || 'An error occurred');
    }
  };

  const handleDone = () => {
    // Clear cart and close
    items.forEach(item => onRemove(item.p.id));
    handleClose();
  };

  const handleTryAgain = () => {
    setPaymentStatus('idle');
    setError('');
  };

  return (
    <div className={`overlay ${closing ? 'out' : 'in'}`} onClick={handleClose}>
      <div
        className="cart-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button className="cart-back" onClick={handleClose} aria-label="back">
          ←
        </button>

        <h2 className="cart-heading">
          {paymentStatus === 'idle' ? 'Order' : 
           paymentStatus === 'processing' ? 'Processing Payment...' :
           paymentStatus === 'success' ? 'Payment Success!' :
           'Payment Failed'}
        </h2>

        <div className="cart-body">
          <div className="cart-left">
            {items.map(({ p, qty }) => (
              <div className="cart-row" key={p.id}>
                <div className="cart-thumb">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="cart-desc">
                  <div className="cart-title">{p.title}</div>
                  <div className="cart-price">IDR{p.price}</div>
                </div>
                <div className="cart-qty">x{qty}</div>
                {paymentStatus === 'idle' && (
                  <button className="cart-remove" onClick={() => onRemove(p.id)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

            <hr className="sep" />
            <div className="cart-total-row">
              <div className="total-label">Total</div>
              <div className="total-value">IDR{total.toLocaleString()}</div>
            </div>
          </div>

          <div className="cart-right">
            {paymentStatus === 'idle' && (
              <div className="pay-panel">
                <h3>Payment Information</h3>
                
                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  Payment Method
                </label>
                <select 
                  className="input" 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  style={{ marginBottom: '12px' }}
                >
                  <option value="E_WALLET">E-Wallet (Dana, OVO, GoPay)</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="QR_CODE">QR Code</option>
                </select>

                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  Username
                </label>
                <input 
                  className="input" 
                  placeholder="Your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                
                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  WhatsApp Number
                </label>
                <input 
                  className="input" 
                  placeholder="08xxxxxxxxxx" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />

                {error && (
                  <div style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginTop: '10px'
                  }}>
                    {error}
                  </div>
                )}

                <button 
                  className="continue-btn"
                  onClick={handlePayment}
                  disabled={!session?.user}
                >
                  {session?.user ? 'Continue to Payment' : 'Login to Continue'}
                </button>
              </div>
            )}

            {paymentStatus === 'processing' && (
              <div className="pay-panel" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
                <h3>Processing...</h3>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>
                  Please wait while we process your payment.
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="pay-panel" style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '80px', 
                  marginBottom: '20px',
                  background: 'white',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'var(--teal)'
                }}>✓</div>
                <h3>Payment Success!</h3>
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '20px' }}>
                  Thank you for your purchase. You can now access your products.
                </p>
                <button 
                  className="continue-btn"
                  onClick={handleDone}
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="pay-panel" style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '80px', 
                  marginBottom: '20px',
                  background: 'white',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#c62828'
                }}>✕</div>
                <h3>Payment Failed!</h3>
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '20px' }}>
                  {error || 'We could not process your payment. Please try again.'}
                </p>
                <button 
                  className="continue-btn"
                  onClick={handleTryAgain}
                  style={{ width: '100%' }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
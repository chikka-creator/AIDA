// src/app/shop/CartModal.tsx
'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Product } from './page';
import { X, Wallet, Building2, QrCode, CreditCard } from 'lucide-react';
import './Cart.css';

type PaymentMethod = 'E_WALLET' | 'BANK_TRANSFER' | 'QRIS' | 'CREDIT_CARD';
type PaymentProvider = 'DANA' | 'OVO' | 'GOPAY' | 'SHOPEEPAY' | 'BCA' | 'MANDIRI' | 'BNI' | 'BRI';

interface ImprovedCartModalProps {
  onClose: () => void;
  items: { p: Product; qty: number }[];
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

export default function ImprovedCartModal({
  onClose,
  items,
  onRemove,
  onClearCart,
}: ImprovedCartModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState<'cart' | 'payment' | 'processing' | 'success' | 'failed'>('cart');
  
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState(session?.user?.email || '');
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('E_WALLET');
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('DANA');
  
  const [purchaseId, setPurchaseId] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState('');

  const total = items.reduce((s, it) => s + it.qty * it.p.price, 0);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'E_WALLET') setPaymentProvider('DANA');
    else if (method === 'BANK_TRANSFER') setPaymentProvider('BCA');
  };

  const handleProceedToPayment = () => {
    if (!session?.user) {
      setError('Please login to continue');
      return;
    }

    if (!username.trim() || !whatsapp.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setStep('payment');
  };

  const handleCreatePayment = async () => {
    setStep('processing');
    setError('');

    try {
      console.log('Creating payment...');
      console.log('Items:', items);
      
      // FIXED: Changed from /api/payment/create to /api/payments/create
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.p.id,
            quantity: item.qty,
          })),
          paymentMethod: paymentProvider,
          paymentType: paymentMethod,
          username,
          whatsapp,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response. Please check the console for details.');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      setPurchaseId(data.purchase.id);
      setPaymentData(data.paymentData);

      // Auto-simulate payment after 3 seconds
      setTimeout(() => {
        simulatePaymentResult(data.purchase.id);
      }, 3000);

    } catch (err: any) {
      console.error('Payment creation error:', err);
      setError(err.message || 'Failed to create payment');
      setStep('payment');
    }
  };

  const simulatePaymentResult = async (purchaseId: string) => {
    try {
      const isSuccess = Math.random() > 0.2;
      
      // FIXED: Changed from /api/payment/simulate to /api/payments/simulate
      const response = await fetch('/api/payments/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseId,
          status: isSuccess ? 'success' : 'failed',
        }),
      });

      const data = await response.json();

      if (isSuccess && data.success) {
        setStep('success');
        setTimeout(() => {
          onClearCart();
        }, 500);
      } else {
        setStep('failed');
      }

    } catch (err: any) {
      console.error('Payment simulation error:', err);
      setError(err.message || 'Payment processing failed');
      setStep('failed');
    }
  };

  const handleRetry = () => {
    setStep('payment');
    setError('');
  };

  const handleGoToLibrary = () => {
    router.push('/owned-products');
    handleClose();
  };

  return (
    <div className={`cart-overlay-new ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <div
        className={`cart-modal-new ${step}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title-new">
            {step === 'cart' && 'Shopping Cart'}
            {step === 'payment' && 'Payment Method'}
            {step === 'processing' && 'Processing Payment'}
            {step === 'success' && 'Payment Successful!'}
            {step === 'failed' && 'Payment Failed'}
          </h2>
          <button className="cart-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Step */}
        {step === 'cart' && (
          <div className="cart-content-new">
            <div className="cart-items-section">
              <h3>Items ({items.length})</h3>
              {items.map(({ p, qty }) => (
                <div className="cart-item-new" key={p.id}>
                  <img src={p.image} alt={p.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{p.title}</h4>
                    <p className="cart-item-price">IDR {p.price.toLocaleString()}</p>
                    <p className="cart-item-qty">Quantity: {qty}</p>
                  </div>
                  <button 
                    className="cart-item-remove"
                    onClick={() => onRemove(p.id)}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-amount">IDR {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="cart-form-section">
              <h3>Contact Information</h3>
              
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Number *</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="form-input"
                  disabled={!!session?.user?.email}
                />
              </div>

              {error && (
                <div className="error-message">{error}</div>
              )}

              <button 
                className="proceed-btn"
                onClick={handleProceedToPayment}
                disabled={!session?.user}
              >
                {session?.user ? 'Proceed to Payment' : 'Login to Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Payment Method Selection Step */}
        {step === 'payment' && (
          <div className="payment-content">
            <div className="payment-methods-grid">
              <div 
                className={`payment-method-card ${paymentMethod === 'E_WALLET' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('E_WALLET')}
              >
                <Wallet size={32} />
                <h4>E-Wallet</h4>
                <p>DANA, OVO, GoPay, ShopeePay</p>
              </div>

              <div 
                className={`payment-method-card ${paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('BANK_TRANSFER')}
              >
                <Building2 size={32} />
                <h4>Bank Transfer</h4>
                <p>BCA, Mandiri, BNI, BRI</p>
              </div>

              <div 
                className={`payment-method-card ${paymentMethod === 'QRIS' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('QRIS')}
              >
                <QrCode size={32} />
                <h4>QRIS</h4>
                <p>Scan QR Code</p>
              </div>

              <div 
                className={`payment-method-card ${paymentMethod === 'CREDIT_CARD' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('CREDIT_CARD')}
              >
                <CreditCard size={32} />
                <h4>Credit Card</h4>
                <p>Visa, Mastercard</p>
              </div>
            </div>

            {paymentMethod === 'E_WALLET' && (
              <div className="provider-selection">
                <h4>Select E-Wallet Provider</h4>
                <div className="provider-buttons">
                  {(['DANA', 'OVO', 'GOPAY', 'SHOPEEPAY'] as PaymentProvider[]).map(provider => (
                    <button
                      key={provider}
                      className={`provider-btn ${paymentProvider === provider ? 'active' : ''}`}
                      onClick={() => setPaymentProvider(provider)}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="provider-selection">
                <h4>Select Bank</h4>
                <div className="provider-buttons">
                  {(['BCA', 'MANDIRI', 'BNI', 'BRI'] as PaymentProvider[]).map(provider => (
                    <button
                      key={provider}
                      className={`provider-btn ${paymentProvider === provider ? 'active' : ''}`}
                      onClick={() => setPaymentProvider(provider)}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="payment-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>IDR {total.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>IDR {total.toLocaleString()}</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="payment-actions">
              <button className="back-btn" onClick={() => setStep('cart')}>
                Back
              </button>
              <button className="pay-btn" onClick={handleCreatePayment}>
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Processing, Success, Failed steps remain the same */}
        {step === 'processing' && (
          <div className="processing-content">
            <div className="processing-spinner"></div>
            <h3>Processing Your Payment</h3>
            <p>Please wait while we process your payment...</p>
            {paymentData && paymentData.type === 'QRIS' && (
              <div className="qris-container">
                <div className="qris-placeholder">
                  <QrCode size={200} />
                  <p>Scan with your mobile banking app</p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Thank you for your purchase. Your products are now available in your library.</p>
            
            <div className="success-details">
              <div className="detail-row">
                <span>Amount Paid:</span>
                <span>IDR {total.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Items:</span>
                <span>{items.length} product(s)</span>
              </div>
            </div>

            <button className="library-btn" onClick={handleGoToLibrary}>
              Go to My Library
            </button>
          </div>
        )}

        {step === 'failed' && (
          <div className="failed-content">
            <div className="failed-icon">✕</div>
            <h3>Payment Failed</h3>
            <p>We couldn't process your payment. Please try again.</p>
            {error && <p className="error-detail">{error}</p>}
            
            <div className="failed-actions">
              <button className="retry-btn" onClick={handleRetry}>
                Try Again
              </button>
              <button className="cancel-btn" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
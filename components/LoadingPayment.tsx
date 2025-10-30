"use client";
import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CheckoutPopupProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onDone: () => void;
  onTryAgain: () => void;
}

type PaymentStatus = 'processing' | 'success' | 'failed';

const CheckoutPopup: React.FC<CheckoutPopupProps> = ({
  isOpen,
  products,
  onClose,
  onDone,
  onTryAgain
}) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('processing');
  const [isClosing, setIsClosing] = useState(false);

  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  const formatPrice = (price: number) => {
    return `IDR${price.toLocaleString('id-ID')}`;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleDone = () => {
    onDone();
    handleClose();
  };

  const handleTryAgain = () => {
    onTryAgain();
    setPaymentStatus('processing');
  };

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('processing');
      // Simulasi proses payment (untuk demo)
      const timer = setTimeout(() => {
        // Random success/failed untuk demo
        setPaymentStatus(Math.random() > 0.5 ? 'success' : 'failed');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .popup-overlay.closing {
          animation: fadeOut 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .popup-container {
          background: white;
          border-radius: 16px;
          padding: 0;
          width: 90%;
          max-width: 600px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        .popup-container.closing {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(50px);
            opacity: 0;
          }
        }

        .popup-header {
          display: flex;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          position: relative;
        }

        .back-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #1e6b7a;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background-color: #155361;
        }

        .popup-title {
          flex: 1;
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          padding-right: 40px;
        }

        .popup-content {
          display: flex;
          padding: 24px;
          gap: 24px;
        }

        .products-section {
          flex: 1;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .product-image {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          object-fit: cover;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          color: black;
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .product-price {
          color: black;
          font-size: 14px;
          margin: 0;
        }

        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
        }

        .total-label {
          color: #1e6b7a;
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .total-price {
          color: #1e6b7a;
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        .status-section {
          flex: 0 0 280px;
          background-color: #e5e7eb;
          border-radius: 12px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .status-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .status-icon.success {
          background-color: #1e6b7a;
        }

        .status-icon.failed {
          background-color: #1e6b7a;
        }

        .status-icon.processing {
          background-color: #94a3b8;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .status-title {
          color: #1e6b7a;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .status-message {
          color: #6b7280;
          font-size: 14px;
          text-align: center;
          margin: 0;
        }

        .status-button {
          background-color: #1e6b7a;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 8px;
        }

        .status-button:hover {
          background-color: #155361;
        }

        .status-button:active {
          transform: scale(0.98);
        }

        @media (max-width: 640px) {
          .popup-content {
            flex-direction: column;
          }

          .status-section {
            flex: 1;
          }
        }
      `}</style>

      <div className={`popup-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
        <div 
          className={`popup-container ${isClosing ? 'closing' : ''}`} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <button className="back-button" onClick={handleClose}>
              ←
            </button>
            <h2 className="popup-title">Checkout & Payment</h2>
          </div>

          <div className="popup-content">
            <div className="products-section">
              {products.map((product) => (
                <div key={product.id} className="product-item">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}

              <div className="total-section">
                <p className="total-label">Total Price</p>
                <p className="total-price">{formatPrice(totalPrice)}</p>
              </div>
            </div>

            <div className="status-section">
              {paymentStatus === 'processing' && (
                <>
                  <div className="status-icon processing">⏳</div>
                  <p className="status-title">Processing...</p>
                  <p className="status-message">Please wait while we process your payment.</p>
                </>
              )}

              {paymentStatus === 'success' && (
                <>
                  <div className="status-icon success">✓</div>
                  <p className="status-title">Payment Success!</p>
                  <p className="status-message">It our pleasure to offer you our products.</p>
                  <button className="status-button" onClick={handleDone}>
                    Done
                  </button>
                </>
              )}

              {paymentStatus === 'failed' && (
                <>
                  <div className="status-icon failed">✕</div>
                  <p className="status-title">Payment Failed!</p>
                  <p className="status-message">It seems we have not received money.</p>
                  <button className="status-button" onClick={handleTryAgain}>
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Demo Component
const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const demoProducts: Product[] = [
    {
      id: '1',
      name: 'Bromo Preset',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Bromo Preset',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Bromo Preset',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'
    }
  ];

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: '#1e6b7a',
          color: 'white',
          border: 'none',
          padding: '16px 32px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Open Checkout Popup
      </button>

      <CheckoutPopup
        isOpen={isOpen}
        products={demoProducts}
        onClose={() => {
          console.log('Popup closed');
          setIsOpen(false);
        }}
        onDone={() => {
          console.log('Payment completed successfully');
        }}
        onTryAgain={() => {
          console.log('Trying payment again');
        }}
      />
    </div>
  );
};

export default App;
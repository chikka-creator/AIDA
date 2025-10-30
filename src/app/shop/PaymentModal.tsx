"use client";

import React, { useEffect } from "react";
import "./PaymentModal.css";
import { Wallet, Banknote, QrCode, ArrowLeft } from "lucide-react";

interface PaymentModalProps {
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button className="back-btn" onClick={onClose}>
          <ArrowLeft size={22} />
        </button>
        <h2 className="payment-title">Checkout & Payment</h2>

        <div className="payment-content">
          {/* Left side - Product list */}
          <div className="payment-left">
            {[1, 2, 3].map((i) => (
              <div key={i} className="payment-item">
                <img
                  src="/images/bromo-preset.jpg"
                  alt="Bromo Preset"
                  className="payment-thumb"
                />
                <div className="payment-item-info">
                  <p className="payment-item-name">Bromo Preset</p>
                  <p className="payment-item-price">IDR125000</p>
                </div>
                <button className="delete-btn">✕</button>
              </div>
            ))}
            <hr className="divider" />
            <div className="total">
              <span>Total</span>
              <span className="total-price">IDR375000</span>
            </div>
          </div>

          {/* Right side - Payment form */}
          <div className="payment-right">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <button className="method-btn">
                <Wallet size={24} />
                <span>E-Wallet</span>
              </button>
              <button className="method-btn">
                <Banknote size={24} />
                <span>Bank</span>
              </button>
              <button className="method-btn">
                <QrCode size={24} />
                <span>QR</span>
              </button>
            </div>

            <form className="payment-form">
              <label>Name on Card</label>
              <input type="text" placeholder="John Doe" />
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
              <button className="pay-btn">Pay</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

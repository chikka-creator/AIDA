'use client';
import React, { useState } from 'react';
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
  const [closing, setClosing] = useState(false);
  const total = items.reduce((s, it) => s + it.qty * it.p.price, 0);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');


  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300);
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

        <h2 className="cart-heading">Order</h2>

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
                <button className="cart-remove" onClick={() => onRemove(p.id)}>
                  Remove
                </button>
              </div>
            ))}

            <hr className="sep" />
            <div className="cart-total-row">
              <div className="total-label">Total</div>
              <div className="total-value">IDR{total}</div>
            </div>
          </div>

          <div className="cart-right">
            <div className="pay-panel">
              <h3>Continue To Payment</h3>
              <label>Username</label>
              <input className="input" placeholder="Username" />
              <label>Whatsapp</label>
              <input className="input" placeholder="08xxxxxxxx" />
              <button className="continue-btn">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

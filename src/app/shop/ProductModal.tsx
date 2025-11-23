'use client';
import React, { useState } from 'react';
import type { Product } from './page';
import './shop.css';

export default function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: () => void;
}) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 320);
  };

  return (
    <div className={`overlay ${closing ? 'out' : 'in'}`} onClick={handleClose}>
      <div
        className="product-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* big dark framed card like screenshot */}
        <div className="frame">
          <div className="frame-inner">
            <div className="modal-media">
              <img src={product.image} alt={product.title} />
            </div>

            <div className="modal-info">
              <h4 className="modal-sub">{product.subtitle}</h4>
              <h2 className="modal-title">{product.title}</h2>
              <p className="modal-desc">{product.description}</p>

              <div className="modal-bottom">
                <div className="modal-price">IDR{product.price}</div>
                <button
                  className="modal-add-btn"
                  onClick={() => {
                    onAdd();
                  }}
                  aria-label="add-to-cart"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import CartModal from './CartModal';
import Navbar from "./Navbar";
import AuthButton from "../components/AuthButton";
import './shop.css';
import '../globals.css';

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'bromo',
    title: 'BROMO ADVENTURE',
    subtitle: 'BROMO PRESET',
    description: 'Preset dengan tone hangat...',
    price: 125000,
    image: '/gambar1.webp',
  },
  {
    id: 'bali',
    title: 'BALI ESCAPE',
    subtitle: 'BALI PRESET',
    description: 'Tone hangat dengan nuansa...',
    price: 115000,
    image: '/gambar2.webp',
  },
  {
    id: 'lombok',
    title: 'LOMBOK DREAM',
    subtitle: 'LOMBOK PRESET',
    description: 'Preset alami dengan warna...',
    price: 99000,
    image: '/gambar3.webp',
  },
  {
    id: 'rinjani',
    title: 'RINJANI TRAIL',
    subtitle: 'RINJANI PRESET',
    description: 'Cocok untuk foto hiking d...',
    price: 110000,
    image: '/gambar4.webp',
  },
  {
    id: 'Gunung',
    title: 'GUNUNG TRAIL',
    subtitle: 'GUNUNG PRESET',
    description: 'Cocok untuk foto hiking d...',
    price: 110000,
    image: '/gambar5.webp',
  },
];

export default function Page() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});

  const openModal = (p: Product) => setSelected(p);
  const closeModal = () => setSelected(null);

  const addToCart = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id)!;
    return { p, qty };
  });

  return (
    <main className="page-root">
      <header className="hero">
        <nav className="topbar">
          <div className="nav-items">
                  <Navbar />
                  <AuthButton />
          </div>
          <div className="cart-icon" onClick={() => setCartOpen(true)}>
            🛒
            {Object.values(cart).length > 0 && (
              <span className="badge">{Object.values(cart).reduce((s, n) => s + n, 0)}</span>
            )}
          </div>
        </nav>
        <h1 className="hero-title">SHOP</h1>
      </header>

      {/* products area overlaps hero */}
      <section className="products-wrap">
        <div className="search-row">
          <input className="search-input" placeholder="Search..." />
          <button className="search-btn">Search</button>
        </div>

        <div className="grid">
          {PRODUCTS.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onClick={() => openModal(p)}
              onAdd={(ev?: React.MouseEvent) => {
                ev?.stopPropagation();
                addToCart(p.id);
              }}
            />
          ))}
        </div>
      </section>

      {/* product modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={closeModal}
          onAdd={() => {
            addToCart(selected.id);
          }}
        />
      )}

      {/* cart modal */}
      {cartOpen && (
        <CartModal
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onRemove={(id: string) => removeFromCart(id)}
        />
      )}
    </main>
  );
}

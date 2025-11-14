// src/app/shop/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  subtitle: string | null;
  description: string;
  price: number;
  thumbnailUrl: string;
  category: string;
  status: string;
};

export default function Page() {
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/auth/check-role');
          const data = await response.json();
          setIsAdmin(data.role === 'ADMIN');
        } catch (err) {
          console.error('Error checking admin status:', err);
        }
      }
    };

    if (status !== 'loading') {
      checkAdmin();
    }
  }, [session, status]);

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

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
    const p = products.find((x) => x.id === id)!;
    return { p, qty };
  });

  const handleProductAdded = () => {
    fetchProducts(); // Refresh products list
    setShowAdminPanel(false);
  };

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

      {/* Admin Controls */}
      {isAdmin && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '30px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            style={{
              background: '#246E76',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            {showAdminPanel ? 'Close Admin Panel' : 'Admin Panel'}
          </button>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && showAdminPanel && (
        <div style={{
          position: 'fixed',
          top: '160px',
          right: '30px',
          zIndex: 99,
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          width: '400px',
        }}>
          {/* Admin product management UI will go here */}
          <p style={{ color: '#333', marginBottom: '10px' }}>Admin Panel - Coming Soon</p>
        </div>
      )}

      {/* products area overlaps hero */}
      <section className="products-wrap">
        <div className="search-row">
          <input className="search-input" placeholder="Search..." />
          <button className="search-btn">Search</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
            Loading products...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#f44336' }}>
            Error: {error}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
            No products available yet.
          </div>
        ) : (
          <div className="grid">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  image: p.thumbnailUrl,
                  subtitle: p.subtitle || '',
                }}
                index={i}
                onClick={() => openModal(p)}
                onAdd={(ev?: React.MouseEvent) => {
                  ev?.stopPropagation();
                  addToCart(p.id);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* product modal */}
      {selected && (
        <ProductModal
          product={{
            ...selected,
            image: selected.thumbnailUrl,
            subtitle: selected.subtitle || '',
          }}
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
          items={cartItems.map(item => ({
            ...item,
            p: {
              ...item.p,
              image: item.p.thumbnailUrl,
              subtitle: item.p.subtitle || '',
            }
          }))}
          onRemove={(id: string) => removeFromCart(id)}
        />
      )}
    </main>
  );
}
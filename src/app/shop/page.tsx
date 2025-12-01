// src/app/shop/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import CartModal from "./CartModal";
import "./Cart.css";
import Navbar from "./Navbar";
import AuthButton from "../components/AuthButton";
import AdminProductManager from "../components/AdminProductManager";
import { useLanguage } from "../contexts/LanguageContext";
import "./shop.css";
import "../globals.css";

type DBProduct = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  price: number;
  thumbnailUrl: string;
  category: string;
  status: string;
};

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: string;
};

type CartItem = {
  id: string;
  productId: string;
  addedAt: string;
  product: DBProduct;
};

export default function Page() {
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/auth/check-role");
          const data = await response.json();
          setIsAdmin(data.role === "ADMIN");
        } catch (err) {
          console.error("Error checking admin status:", err);
        }
      }
    };

    if (status !== "loading") {
      checkAdmin();
    }
  }, [session, status]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch cart when user logs in
  useEffect(() => {
    if (session?.user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: DBProduct[] = await response.json();
      const transformedProducts: Product[] = data.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle || "",
        description: p.description,
        price: p.price,
        image: p.thumbnailUrl,
        category: p.category,
        status: p.status,
      }));

      setProducts(transformedProducts);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleCartClick = () => {
    console.log("Cart clicked! Session:", session);
    console.log("Cart items:", cartItems);
    console.log("Current cartOpen state:", cartOpen);
    
    if (!session?.user) {
      alert("Please login to view your cart");
      return;
    }
    
    console.log("Opening cart...");
    setCartOpen(true);
  };

  const addToCart = async (productId: string) => {
    if (!session?.user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        await fetchCart();
        alert("Product added to cart!");
      } else {
        const data = await response.json();
        if (data.message === "Item already in cart") {
          alert("Item is already in your cart");
        } else {
          throw new Error(data.error || "Failed to add to cart");
        }
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      alert(err.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const openModal = (p: Product) => setSelected(p);
  const closeModal = () => setSelected(null);

  const handleProductAdded = () => {
    fetchProducts();
    setShowAdminPanel(false);
  };

  // Transform cart items to match CartModal expected format
  const cartItemsForModal = cartItems.map((item) => ({
    p: {
      id: item.product.id,
      title: item.product.title,
      subtitle: item.product.subtitle || "",
      description: item.product.description,
      price: item.product.price,
      image: item.product.thumbnailUrl,
      category: item.product.category,
      status: item.product.status,
    },
    qty: 1,
  }));

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="page-root">
      <header className="hero">
        <nav className="topbar">
          <div className="nav-items">
            <Navbar />
            <AuthButton />
          </div>
          {/* FIXED: Better positioned cart icon with click handler */}
          <button
            onClick={handleCartClick}
            className="cart-icon"
            style={{
              position: 'fixed',
              right: session?.user ? '90px' : '140px',
              top: '20px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '50px',
              padding: '10px',
              border: 'none',
              zIndex: 200,
              transition: 'transform 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = 'rgba(0, 0, 0, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
            }}
          >
            🛒
            {cartItems.length > 0 && (
              <span className="badge">{cartItems.length}</span>
            )}
          </button>
        </nav>
        <h1 className="hero-title">{t.shop.title}</h1>
      </header>

      {isAdmin && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            left: "30px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            style={{
              background: "#246E76",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {showAdminPanel ? "Close Admin Panel" : "Admin Panel"}
          </button>
        </div>
      )}

      {isAdmin && showAdminPanel && (
        <div
          style={{
            position: "fixed",
            top: "160px",
            left: "30px",
            zIndex: 99,
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            width: "fit-content",
          }}
        >
          <AdminProductManager onProductAdded={handleProductAdded} />
        </div>
      )}

      <section className="products-wrap">
        <div className="search-row">
          <input
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>

        <div className="grid-container">
          {loading ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "white" }}
            >
              Loading products...
            </div>
          ) : error ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#f44336" }}
            >
              Error: {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "white" }}
            >
              {searchQuery
                ? "No products found."
                : "No products available yet."}
            </div>
          ) : (
            <div className="grid">
              {filteredProducts.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                >
                  <ProductCard
                    product={p}
                    index={i}
                    onClick={() => openModal(p)}
                    onAdd={(ev?: React.MouseEvent) => {
                      ev?.stopPropagation();
                      addToCart(p.id);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <ProductModal
          product={selected}
          onClose={closeModal}
          onAdd={() => {
            addToCart(selected.id);
          }}
        />
      )}

      {cartOpen && (
        <>
          {console.log("Rendering CartModal with:", { cartOpen, itemsCount: cartItemsForModal.length })}
          <CartModal
            onClose={() => {
              console.log("Closing cart");
              setCartOpen(false);
            }}
            items={cartItemsForModal}
            onRemove={(productId: string) => {
              const item = cartItems.find((i) => i.product.id === productId);
              if (item) removeFromCart(item.id);
            }}
            onClearCart={clearCart}
          />
        </>
      )}
    </main>
  );
}
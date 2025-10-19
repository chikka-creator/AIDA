"use client";
import React, { useEffect, useState } from "react";
import "./shop.css";
import Navbar from "./Navbar";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

const productsData: Product[] = [
  { id: 1, name: "Bromo Adventure", description: "Explore the sunrise beauty.", price: 250, image: "/gambar1.jpg" },
  { id: 2, name: "Mountain Preset", description: "Perfect tones for mountain shots.", price: 120, image: "/gambar2.jpg" },
  { id: 3, name: "Nature Spirit", description: "Bring nature to your edits.", price: 180, image: "/gambar3.jpg" },
  { id: 4, name: "Foggy Dawn", description: "Soft misty presets for cool tones.", price: 200, image: "/gambar4.jpg" },
  { id: 5, name: "Golden Light", description: "Warm cinematic mood for sunsets.", price: 230, image: "/gambar5.jpg" },
  { id: 6, name: "Cold Peak", description: "High-altitude clarity and cool tones.", price: 190, image: "/gambar6.jpg" },
  { id: 7, name: "Adventure Kit", description: "Full Bromo preset pack bundle.", price: 300, image: "/gambar7.jpg" },
  { id: 8, name: "Cloud Dream", description: "Ethereal pastel tone collection.", price: 210, image: "/gambar8.jpg" },
  { id: 9, name: "Desert Edge", description: "Dry tones for harsh landscapes.", price: 220, image: "/gambar9.jpg" },
  { id: 10, name: "Skyline Mood", description: "Bright tone, clear details.", price: 250, image: "/gambar10.jpg" },
];

// default popup mode for cart, can be set to "center" if desired
const popupMode: "center" | "right" = "center";

export default function ShopPage() {
  // search state (real-time)
  const [search, setSearch] = useState<string>("");

  // filtered products based on search
  const [filtered, setFiltered] = useState<Product[]>(productsData);

  // pagination
  const perPage = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // selected product for product popup (CENTER modal)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // cart data and cart popup toggle
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);

  // parallax var for SHOP title (inline style via CSS var)
  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY * 0.25;
      document.documentElement.style.setProperty("--parallax-offset", `${offset}px`);
      // optional fade effect handled by CSS using scrollY via JS is already applied where needed
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // update filtered list on search change (real-time) and reset page
  useEffect(() => {
    const q = search.trim().toLowerCase();
    const f = productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setFiltered(f);
    setCurrentPage(1);
  }, [search]);

  // pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (currentPage - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  // add product to cart (works from card bottom + from product popup)
  const addToCart = (product: Product) => {
    setCart((prev) => {
      // if product already exists, increment quantity logic could be added,
      // but per requirement we keep a simple array of added items.
      return [...prev, product];
    });
  };

  // remove one item by index/ id (removes all with same id - keep simple)
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p, idx) => p.id !== id));
  };

  // compute total
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  // lock body scroll when any modal is open
  useEffect(() => {
    const anyOpen = !!selectedProduct || showCart;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct, showCart]);

  // short helper to open cart with focus
  const openCart = () => setShowCart(true);

  return (
            <div className="shop-container">
    <header>
            <Navbar />
    </header>
      {/* big SHOP title behind layer (parallax via --parallax-offset) */}
      
      <div className="shop-title">SHOP</div>

      {/* top overlay (visual) */}
      <div className="overlay-layer" />

      {/* search bar (real-time) */}
      <div className="search-bar">
        <input
          aria-label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
        <button aria-label="Search button">
          {/* keep icon file optional; fallback to text if missing */}
          <img src="/search.png" alt="search" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </button>
      </div>

      {/* cart icon sticky */}
      <button className="cart-icon" aria-label="Open cart" onClick={openCart}>
        🛒
        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </button>

      {/* product grid */}
      <div className="product-grid">
        {currentProducts.length === 0 ? (
          <div className="no-product">No products found</div>
        ) : (
          currentProducts.map((p) => (
            <article
              className="product-card"
              key={p.id}
              // clicking card (except the small + button) opens product popup
              onClick={() => setSelectedProduct(p)}
            >
              <img src={p.image} alt={p.name} className="product-image" />

              <div className="product-body">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-desc">{p.description}</p>
              </div>

              <div className="price-area">
                <span className="price-text">Rp{p.price.toLocaleString()}</span>

                {/* plus button must NOT open popup; stopPropagation */}
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  aria-label={`Add ${p.name} to cart`}
                >
                  +
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* pagination (numbers) */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              className={`page-btn ${page === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* ========== Product Popup (CENTER modal) ========== */}
      {selectedProduct && (
        <div
          className="popup-overlay product-popup-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="popup-content product-popup-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProduct.name} details`}
          >
            <button className="close-btn" onClick={() => setSelectedProduct(null)} aria-label="Close product">
              ✕
            </button>

            <img src={selectedProduct.image} alt={selectedProduct.name} />

            <h2>{selectedProduct.name}</h2>
            <p className="popup-desc">{selectedProduct.description}</p>

            <div className="price-area">
              <span className="price-text">Rp{selectedProduct.price.toLocaleString()}</span>
              <button
                className="add-btn"
                onClick={() => {
                  addToCart(selectedProduct);
                }}
                aria-label={`Add ${selectedProduct.name} to cart`}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Cart Popup (mode controlled by popupMode) ========== */}
      {showCart && (
        <div
          className={`popup-overlay cart-popup-overlay ${popupMode === "right" ? "" : "center-mode"}`}
          onClick={() => setShowCart(false)}
        >
          <div
            className={`popup-content cart-popup-content ${popupMode === "right" ? "slide-right" : "slide-center"}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
          >
            <button className="close-btn" onClick={() => setShowCart(false)} aria-label="Close cart">
              ✕
            </button>

            <h2>Your Cart</h2>

            {cart.length === 0 ? (
              <p className="no-product">No items in cart</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cart.map((item, i) => (
                    <li key={`${item.id}-${i}`} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span>Rp{item.price.toLocaleString()}</span>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </li>
                  ))}
                </ul>

                <div className="cart-total">
                  <strong>Total:</strong> Rp{total.toLocaleString()}
                </div>

                <div style={{ marginTop: 14, textAlign: "right" }}>
                  <button className="checkout-btn" onClick={() => alert("Checkout not implemented in demo.")}>
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

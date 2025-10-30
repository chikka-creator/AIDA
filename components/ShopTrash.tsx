import React, { useState } from 'react';
import { Search, Trash2, Plus } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar1'
    },
    {
      id: 2,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar2'
    },
    {
      id: 3,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar3'
    },
    {
      id: 4,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar4'
    },
    {
      id: 5,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar5'
    },
    {
      id: 6,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar6'
    },
    {
      id: 7,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar7'
    },
    {
      id: 8,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar8'
    },
    {
      id: 9,
      title: 'BROMO PRESET',
      description: 'Lorem ipsum hic est hac',
      price: 'Rp 15k',
      image: '/gambar9'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleAddToCart = (id: number) => {
    console.log('Add to cart:', id);
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          min-height: 100vh;
          background: linear-gradient(to bottom, #2dd4bf, #14b8a6, #0d9488);
          position: relative;
        }

        .title-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding-top: 48px;
          pointer-events: none;
        }

        .title-background h1 {
          color: white;
          font-size: 12rem;
          font-weight: bold;
          text-align: center;
          letter-spacing: 0.1em;
          opacity: 0.4;
          margin: 0;
        }

        .main-content {
          position: relative;
          z-index: 10;
          max-width: 1280px;
          margin: 0 auto;
          padding: 192px 32px 0;
        }

        .product-section {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .search-container {
          max-width: 448px;
          margin: 0 auto 40px;
        }

        .search-bar {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(4px);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          padding: 10px 20px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        .search-bar input {
          background: transparent;
          color: white;
          outline: none;
          border: none;
          flex: 1;
          font-size: 14px;
        }

        .search-bar input::placeholder {
          color: #6b7280;
        }

        .search-icon {
          color: #6b7280;
          margin-left: 12px;
          flex-shrink: 0;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .product-card {
          background: rgba(31, 41, 55, 0.4);
          backdrop-filter: blur(4px);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(55, 65, 81, 0.5);
          transition: all 0.3s ease;
        }

        .product-card:hover {
          border-color: rgba(55, 65, 81, 1);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          padding-top: 100%;
          background: black;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .trash-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: none;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

        .trash-button:hover {
          background: #f3f4f6;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .trash-icon {
          color: #111827;
        }

        .product-info {
          padding: 20px;
          background: rgba(31, 41, 55, 0.3);
        }

        .product-info-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .product-details {
          flex: 1;
        }

        .product-title {
          color: white;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .product-description {
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .product-price {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .add-button {
          background: #374151;
          border: none;
          border-radius: 9999px;
          padding: 10px;
          margin-left: 16px;
          cursor: pointer;
          transition: background 0.2s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

        .add-button:hover {
          background: #4b5563;
        }

        .add-icon {
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 80px 0;
        }

        .empty-state-title {
          color: white;
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .empty-state-subtitle {
          color: #99f6e4;
          font-size: 14px;
        }
      `}</style>

      <div className="container">
        <div className="title-background">
          <h1>SHOP</h1>
        </div>

        <div className="main-content">
          <div className="product-section">
            <div className="search-container">
              <div className="search-bar">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="" 
                />
                <Search className="search-icon" size={18} />
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="product-image"
                    />
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="trash-button"
                    >
                      <Trash2 className="trash-icon" size={32} />
                    </button>
                  </div>

                  <div className="product-info">
                    <div className="product-info-content">
                      <div className="product-details">
                        <h3 className="product-title">{product.title}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">{product.price}</p>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        className="add-button"
                      >
                        <Plus className="add-icon" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <p className="empty-state-title">No products found</p>
                <p className="empty-state-subtitle">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { Camera, FolderOpen, X, Edit3, Trash2, PlusCircle, Edit, Search } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  price: number;
  thumbnailUrl: string;
  category: string;
  status: string;
}

interface AdminProductManagerProps {
  onProductAdded: (product: any) => void;
}

// Delete Confirmation Popup Component
function DeleteConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productTitle,
  loading 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productTitle: string;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '18px',
          width: '90%',
          maxWidth: '480px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #f44336, #e53935)',
          padding: '24px',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: 'white',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <X size={18} />
          </button>

          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            fontSize: '32px',
          }}>
            ⚠️
          </div>

          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0',
          }}>
            Delete Product?
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{
            color: '#666',
            fontSize: '16px',
            textAlign: 'center',
            lineHeight: '1.6',
            margin: '0 0 8px',
          }}>
            Are you sure you want to delete
          </p>
          <p style={{
            color: '#246E76',
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0 0 16px',
          }}>
            "{productTitle}"
          </p>
          <p style={{
            color: '#999',
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: '1.5',
            margin: '0',
          }}>
            If this product has been purchased, it will be archived instead of deleted.
          </p>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
          }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: loading ? '#999' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }}></span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AdminProductManager({ onProductAdded }: AdminProductManagerProps) {
  const [stage, setStage] = useState<'closed' | 'edit' | 'add' | 'manage'>('closed');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean; product: Product | null}>({
    isOpen: false,
    product: null
  });
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    thumbnailUrl: '',
    category: 'LIGHTROOM_PRESET',
  });

  // Fetch products when entering manage mode
  useEffect(() => {
    if (stage === 'manage') {
      fetchProducts();
    }
  }, [stage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openToEdit = () => {
    if (isAnimating || stage !== 'closed') return;
    setIsAnimating(true);
    setStage('edit');
    setTimeout(() => {
      setShowContent(true);
      setIsAnimating(false);
    }, 350);
  };

  const goToAddProduct = () => {
    if (isAnimating || stage !== 'edit') return;
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setStage('add');
      setEditingProduct(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        price: '',
        thumbnailUrl: '',
        category: 'LIGHTROOM_PRESET',
      });
      setError('');
      setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, 350);
    }, 220);
  };

  const goToManageProducts = () => {
    if (isAnimating || stage !== 'edit') return;
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setStage('manage');
      setError('');
      setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, 350);
    }, 220);
  };

  const backToEdit = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setStage('edit');
      setEditingProduct(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        price: '',
        thumbnailUrl: '',
        category: 'LIGHTROOM_PRESET',
      });
      setError('');
      setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, 350);
    }, 220);
  };

  const closeAll = () => {
    if (isAnimating || stage === 'closed') return;
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setStage('closed');
      setEditingProduct(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        price: '',
        thumbnailUrl: '',
        category: 'LIGHTROOM_PRESET',
      });
      setError('');
      setTimeout(() => {
        setIsAnimating(false);
      }, 350);
    }, 220);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.thumbnailUrl) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          imageUrls: [formData.thumbnailUrl],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${editingProduct ? 'update' : 'create'} product`);
      }

      // Success - notify parent and refresh
      onProductAdded(data);
      
      // Go back to edit view
      setTimeout(() => {
        backToEdit();
      }, 500);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      subtitle: product.subtitle || '',
      description: product.description,
      price: product.price.toString(),
      thumbnailUrl: product.thumbnailUrl,
      category: product.category,
    });
    
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setStage('add');
      setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, 350);
    }, 220);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteConfirm({ isOpen: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.product) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/products/${deleteConfirm.product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      // Update local state
      setProducts(products.filter(p => p.id !== deleteConfirm.product!.id));
      
      // Notify parent component
      onProductAdded(null);
      
      // Close confirmation popup
      setDeleteConfirm({ isOpen: false, product: null });
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStageWidth = () => {
    if (stage === 'closed') return '120px';
    if (stage === 'edit') return '500px';
    if (stage === 'add') return '400px';
    if (stage === 'manage') return '700px';
    return '120px';
  };

  const getStageHeight = () => {
    if (stage === 'closed') return '40px';
    if (stage === 'edit') return '180px';
    if (stage === 'add') return '520px';
    if (stage === 'manage') return '600px';
    return '40px';
  };

  return (
    <>
      <div style={{ 
        display: 'inline-block', 
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div
          style={{
            backgroundColor: stage === 'closed' ? '#135D66' : 'transparent',
            border: stage === 'closed' ? '1px solid #e5e4e0' : 'none',
            borderRadius: stage === 'closed' ? '14px' : '18px',
            padding: stage === 'closed' ? '10px 18px' : '0',
            color: stage === 'closed' ? '#222' : 'inherit',
            cursor: stage === 'closed' ? 'pointer' : 'default',
            width: '100%',
            maxWidth: getStageWidth(),
            height: getStageHeight(),
            display: 'flex',
            alignItems: stage === 'closed' ? 'center' : 'stretch',
            justifyContent: stage === 'closed' ? 'center' : 'stretch',
            overflow: 'hidden',
            transition: isAnimating ? 'all 0.36s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            boxShadow: stage !== 'closed' ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
            background: stage === 'add' || stage === 'manage' ? '#ffffff' : (stage === 'edit' ? '#0f6d66' : '#135D66'),
            margin: '0 auto',
          }}
          onClick={() => {
            if (stage === 'closed') openToEdit();
          }}
        >
          {stage === 'closed' && !isAnimating && (
            <span style={{ fontSize: '15px', color: 'white', userSelect: 'none' }}>
              Create New
            </span>
          )}

          {(stage === 'edit' || stage === 'add' || stage === 'manage' || isAnimating) && (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  gap: '8px',
                  borderTopLeftRadius: '18px',
                  borderTopRightRadius: '18px',
                  background: (stage === 'add' || stage === 'manage') ? '#0f6d66' : 'transparent',
                  color: 'white',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      border: '2px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <Edit3 size={20} />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: 'inherit' }}>
                    {stage === 'edit' ? 'Edit' : stage === 'manage' ? 'Manage Products' : editingProduct ? 'Edit Product' : 'Add Product'}
                  </div>
                </div>

                <button
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: 'none',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAll();
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Edit View */}
              {stage === 'edit' && (
                <div
                  style={{
                    padding: '5px',
                    flex: 1,
                    display: showContent ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    background: 'white',
                    animation: showContent ? 'contentFadeIn 0.28s ease forwards' : 'contentFadeOut 0.22s ease forwards',
                  }}
                >
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 18px',
                        borderRadius: '28px',
                        background: 'rgba(15,109,102,0.9)',
                        color: 'white',
                        border: 'none',
                        width: '90%',
                        maxWidth: '240px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                      }}
                      onClick={goToAddProduct}
                    >
                      <PlusCircle size={22} />
                      <span>Add Product</span>
                    </button>

                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 18px',
                        borderRadius: '28px',
                        background: 'rgba(0,0,0,0.05)',
                        color: '#333',
                        border: 'none',
                        width: '90%',
                        maxWidth: '240px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                      }}
                      onClick={goToManageProducts}
                    >
                      <Edit size={22} />
                      <span>Manage Products</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Manage Products View */}
              {stage === 'manage' && (
                <div
                  style={{
                    display: showContent ? 'flex' : 'none',
                    flexDirection: 'column',
                    padding: '14px',
                    gap: '12px',
                    animation: showContent ? 'contentFadeIn 0.28s ease forwards' : 'contentFadeOut 0.22s ease forwards',
                    overflowY: 'auto',
                    maxHeight: '500px',
                  }}
                >
                  {/* Search */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                      }}
                    />
                    <Search size={20} style={{ color: '#666' }} />
                  </div>

                  {error && (
                    <div style={{ color: '#f44336', fontSize: '13px', padding: '8px', background: '#ffebee', borderRadius: '6px' }}>
                      {error}
                    </div>
                  )}

                  {/* Product List */}
                  {loading && !deleteConfirm.isOpen ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      Loading...
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      {searchQuery ? 'No products found matching your search' : 'No products available'}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px',
                            background: '#f9f9f9',
                            borderRadius: '8px',
                            border: '1px solid #eee',
                          }}
                        >
                          <img
                            src={product.thumbnailUrl}
                            alt={product.title}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              IDR {product.price.toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleEdit(product)}
                            disabled={loading}
                            style={{
                              background: '#0f6d66',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              opacity: loading ? 0.5 : 1,
                            }}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            disabled={loading}
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              opacity: loading ? 0.5 : 1,
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={backToEdit}
                    disabled={loading}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      background: 'transparent',
                      color: '#0f6d66',
                      border: '1px solid #0f6d66',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    Back
                  </button>
                </div>
              )}

              {/* Add/Edit Product View */}
              {stage === 'add' && (
                <div
                  style={{
                    display: showContent ? 'flex' : 'none',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    animation: showContent ? 'contentFadeIn 0.28s ease forwards' : 'contentFadeOut 0.22s ease forwards',
                    overflowY: 'auto',
                    maxHeight: 'calc(520px - 54px)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      style={{
                        background: '#0f6d66',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        width: '140px',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <Camera size={24} />
                      <span style={{ fontSize: '14px' }}>Take Photo</span>
                    </button>

                    <button
                      style={{
                        background: '#0f6d66',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        width: '140px',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <FolderOpen size={24} />
                      <span style={{ fontSize: '14px' }}>Add Photo</span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '4px 8px',
                    }}
                  >
                    <input
                      style={{
                        background: '#f2f2f2',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                      placeholder="Product Title *"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      disabled={loading}
                    />
                    <input
                      style={{
                        background: '#f2f2f2',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                      placeholder="Subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      disabled={loading}
                    />
                    <textarea
                      style={{
                        background: '#f2f2f2',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '14px',
                        outline: 'none',
                        minHeight: '60px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                      }}
                      placeholder="Description *"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      disabled={loading}
                    />
                    <input
                      style={{
                        background: '#f2f2f2',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                      type="number"
                      placeholder="Price (IDR) *"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      disabled={loading}
                    />
                    <input
                      style={{
                        background: '#f2f2f2',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                      placeholder="Image URL *"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      required
                      disabled={loading}
                    />

                    <select
                      style={{
                        background: '#f2f2f2',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      disabled={loading}
                    >
                      <option value="LIGHTROOM_PRESET">Lightroom Preset</option>
                      <option value="PHOTOSHOP_ACTION">Photoshop Action</option>
                      <option value="LUT">LUT</option>
                      <option value="TEMPLATE">Template</option>
                      <option value="BUNDLE">Bundle</option>
                      <option value="OTHER">Other</option>
                    </select>

                    {error && (
                      <div style={{ color: '#f44336', fontSize: '13px', padding: '8px', background: '#ffebee', borderRadius: '6px' }}>
                        {error}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', marginTop: '6px' }}>
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          color: '#777777',
                          border: '1px solid #ddd',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          opacity: loading ? 0.5 : 1,
                        }}
                        onClick={backToEdit}
                        disabled={loading}
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        style={{
                          background: '#0f6d66',
                          color: 'white',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.6 : 1,
                          fontSize: '14px',
                        }}
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <style>{`
          @keyframes contentFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes contentFadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(8px); }
          }
        `}</style>
      </div>

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={deleteConfirm.isOpen}
        onClose={() => !loading && setDeleteConfirm({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        productTitle={deleteConfirm.product?.title || ''}
        loading={loading}
      />
    </>
  );
}
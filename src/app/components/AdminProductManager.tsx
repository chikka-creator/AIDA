import React, { useState } from 'react';
import { Camera, FolderOpen, X, Edit3, Trash2, PlusCircle } from 'lucide-react';

type Stage = 'closed' | 'edit' | 'add';

export default function AdminProductManager({ onProductAdded }) {
  const [stage, setStage] = useState<Stage>('closed');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    thumbnailUrl: '',
    category: 'LIGHTROOM_PRESET',
  });

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

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          imageUrls: [formData.thumbnailUrl],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      // Success
      onProductAdded?.(data);
      closeAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <div
        style={{
          backgroundColor: stage === 'closed' ? '#135D66' : 'transparent',
          border: stage === 'closed' ? '1px solid #e5e4e0' : 'none',
          borderRadius: stage === 'closed' ? '14px' : (stage === 'edit' ? '18px' : '18px'),
          padding: stage === 'closed' ? '10px 18px' : '0',
          color: stage === 'closed' ? '#222' : 'inherit',
          cursor: stage === 'closed' ? 'pointer' : 'default',
          width: stage === 'closed' ? '120px' : (stage === 'edit' ? '500px' : '400px'),
          height: stage === 'closed' ? '40px' : (stage === 'edit' ? '200px' : '520px'),
          display: 'flex',
          alignItems: stage === 'closed' ? 'center' : 'stretch',
          justifyContent: stage === 'closed' ? 'center' : 'stretch',
          overflow: 'hidden',
          transition: isAnimating ? 'all 0.36s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          boxShadow: stage !== 'closed' ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
          background: stage === 'add' ? '#ffffff' : (stage === 'edit' ? '#0f6d66' : '#135D66'),
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

        {(stage === 'edit' || stage === 'add' || isAnimating) && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                gap: '8px',
                borderTopLeftRadius: '18px',
                borderTopRightRadius: '18px',
                background: stage === 'add' ? '#0f6d66' : 'transparent',
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
                  {stage === 'edit' ? 'Edit' : 'Add Product'}
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

            {stage === 'edit' && (
              <div
                style={{
                  padding: '14px',
                  flex: 1,
                  display: showContent ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  background: 'white',
                  animation: showContent ? 'contentFadeIn 0.28s ease forwards' : 'contentFadeOut 0.22s ease forwards',
                }}
              >
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 18px',
                      borderRadius: '28px',
                      background: 'rgba(255,255,255,0.12)',
                      color: 'black',
                      border: 'none',
                      minWidth: '200px',
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
                      background: 'rgba(255,255,255,0.08)',
                      color: 'black',
                      border: 'none',
                      minWidth: '200px',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                  >
                    <Trash2 size={22} />
                    <span>Manage Products</span>
                  </button>
                </div>
              </div>
            )}

            {stage === 'add' && (
              <div
                style={{
                  display: showContent ? 'flex' : 'none',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  gap: '12px',
                  animation: showContent ? 'contentFadeIn 0.28s ease forwards' : 'contentFadeOut 0.22s ease forwards',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', padding: '10px 6px' }}>
                  <button
                    style={{
                      background: '#0f6d66',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      width: '150px',
                      height: '92px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Camera size={28} />
                    <span>Take Photo</span>
                  </button>

                  <button
                    style={{
                      background: '#0f6d66',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      width: '150px',
                      height: '92px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <FolderOpen size={28} />
                    <span>Add Photo</span>
                  </button>
                </div>

                <form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '4px 18px 18px 18px',
                  }}
                  onSubmit={handleSubmit}
                >
                  <input
                    style={{
                      background: '#f2f2f2',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <input
                    style={{
                      background: '#f2f2f2',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    placeholder="Subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                  <input
                    style={{
                      background: '#f2f2f2',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <input
                    style={{
                      background: '#f2f2f2',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    type="number"
                    placeholder="Price (IDR)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                  <input
                    style={{
                      background: '#f2f2f2',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    placeholder="Image URL"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    required
                  />

                  {error && (
                    <div style={{ color: '#f44336', fontSize: '14px', padding: '8px' }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginTop: '6px' }}>
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        color: '#777777',
                        border: '1px solid #ddd',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={closeAll}
                      disabled={loading}
                    >
                      Cancel
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
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Product'}
                    </button>
                  </div>
                </form>
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
  );
}
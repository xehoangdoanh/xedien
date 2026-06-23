import React from 'react';
import { BatteryCharging, Gauge, Zap, Bike, MessageCircle, Eye } from 'lucide-react';

export default function ProductCard({ product, onSelect, onChatPress }) {
  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case 'motorbike': return 'Xe máy';
      case 'bicycle': return 'Xe đạp';
      case 'ebike': return 'Xe đạp điện';
      case 'emotorbike': return 'Xe máy điện';
      default: return 'Xe';
    }
  };

  const renderSpecsSnippet = () => {
    if (product.type === 'bicycle') {
      return (
        <>
          {product.specs.frame && (
            <span className="card-spec-tag">
              <Bike size={12} /> {product.specs.frame.split(' ')[0]}
            </span>
          )}
          {product.specs.weight && (
            <span className="card-spec-tag">
              Cân nặng: {product.specs.weight}
            </span>
          )}
        </>
      );
    }

    return (
      <>
        {product.specs.range && (
          <span className="card-spec-tag">
            <BatteryCharging size={12} /> {product.specs.range.split(' ')[0]} km
          </span>
        )}
        {product.specs.maxSpeed && (
          <span className="card-spec-tag">
            <Gauge size={12} /> {product.specs.maxSpeed}
          </span>
        )}
        {product.specs.engine && (
          <span className="card-spec-tag">
            <Zap size={12} /> {product.specs.engine}
          </span>
        )}
      </>
    );
  };

  return (
    <div className="product-card" onClick={() => onSelect(product)}>
      <div className="product-card-image-wrapper">
        <img 
          src={(product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'} 
          alt={product.name} 
          className="product-card-image"
          loading="lazy"
        />
        <div className="badge-container">
          <span className="card-badge badge-type">{getVehicleTypeLabel(product.type)}</span>
          {product.priceMode === 'sale' && (
            <span className="card-badge badge-sale">Giảm giá</span>
          )}
        </div>
      </div>

      <div className="product-card-content">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-pricing">
          {product.priceMode === 'normal' && (
            <span className="price-current">{formatPrice(product.price)}</span>
          )}
          
          {product.priceMode === 'sale' && (
            <>
              <span className="price-current sale">{formatPrice(product.price)}</span>
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            </>
          )}

          {product.priceMode === 'contact' && (
            <span className="price-contact">Giá liên hệ</span>
          )}

          {product.priceMode === 'hidden' && (
            <span className="price-hidden">Giá: Hộp thư / Inbox</span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '6px' }}>
          <div className="card-specs-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1, minWidth: 0 }}>
            {renderSpecsSnippet()}
          </div>
          
          <button 
            className="sheet-close-btn"
            title="Chat hỏi xe"
            style={{ 
              width: '32px', 
              height: '32px', 
              background: 'var(--primary-container)', 
              color: 'var(--primary)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onChatPress(product);
            }}
          >
            <MessageCircle size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

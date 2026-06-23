import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, MessageSquare, MapPin, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductSheet({ product, onClose, onChatPress, onViewMap, shopPhone }) {
  const sheetRef = useRef(null);

  // Close sheet on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Retrieve images list
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'];

  // Infinite Carousel States
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchMoveOffset, setTouchMoveOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderTrackRef = useRef(null);

  // Cloned list of slides for infinite loop: [clonedLast, ...realItems, clonedFirst]
  const hasMultipleImages = images.length > 1;
  const slides = hasMultipleImages 
    ? [images[images.length - 1], ...images, images[0]] 
    : images;

  // Handle Touch Start (Mobile gesture)
  const handleTouchStart = (e) => {
    if (!hasMultipleImages) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchMoveOffset(0);
    setIsDragging(true);
    setIsTransitioning(false); // disable animation while tracking finger
  };

  // Handle Touch Move
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const offset = currentX - touchStartX;
    
    // Dampen drag offset beyond slide limits
    setTouchMoveOffset(offset);
  };

  // Handle Touch End
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true); // turn back on transitions
    
    const swipeThreshold = 55; // pixels needed to switch slide
    if (touchMoveOffset > swipeThreshold) {
      // Swiped right -> go to previous slide
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else if (touchMoveOffset < -swipeThreshold) {
      // Swiped left -> go to next slide
      setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
    } else {
      // Snap back to current slide
      setCurrentIndex(currentIndex);
    }
    setTouchMoveOffset(0);
  };

  // Mouse Drag Simulator (helps desktop users experience swipe)
  const handleMouseDown = (e) => {
    if (!hasMultipleImages) return;
    setTouchStartX(e.clientX);
    setTouchMoveOffset(0);
    setIsDragging(true);
    setIsTransitioning(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const offset = e.clientX - touchStartX;
    setTouchMoveOffset(offset);
  };

  const handleMouseUpOrLeave = () => {
    handleTouchEnd();
  };

  // Handle Infinite Loop Snapping on Transition End
  const handleTransitionEnd = () => {
    if (!hasMultipleImages) return;
    
    if (currentIndex === 0) {
      // Jump instantly to the last real image
      setIsTransitioning(false);
      setCurrentIndex(images.length);
    } else if (currentIndex === slides.length - 1) {
      // Jump instantly to the first real image
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  // Re-enable transitions after instant jump
  useEffect(() => {
    if (!isTransitioning) {
      // Force repaint to make browser register transition-disabled state, then re-enable
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Autoplay (optional, pauses on drag)
  useEffect(() => {
    if (!hasMultipleImages || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= slides.length - 1) return 1;
        return prev + 1;
      });
    }, 4500);
    
    return () => clearInterval(interval);
  }, [hasMultipleImages, isDragging, currentIndex]);

  // Safe manual controls
  const handlePrev = () => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex >= slides.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case 'motorbike': return 'Xe máy xăng';
      case 'bicycle': return 'Xe đạp cơ';
      case 'ebike': return 'Xe đạp điện';
      case 'emotorbike': return 'Xe máy điện';
      default: return 'Xe';
    }
  };

  // Convert technical keys to comprehensive user-friendly Vietnamese labels
  const getSpecLabel = (key) => {
    const labels = {
      battery: 'Dung lượng PIN / Ắc quy',
      batteryType: 'Công nghệ Pin / Cell pin',
      range: 'Quãng đường tối đa',
      maxSpeed: 'Vận tốc tối đa',
      chargeTime: 'Thời gian sạc đầy',
      power: 'Công suất động cơ',
      motorType: 'Động cơ',
      torque: 'Mô-men xoắn cực đại',
      brakes: 'Hệ thống phanh',
      tires: 'Kích thước lốp xe',
      waterproof: 'Tiêu chuẩn kháng nước',
      weight: 'Trọng lượng xe',
      engine: 'Dung tích xi lanh',
      engineType: 'Kiểu động cơ xăng',
      fuelConsumption: 'Tiêu hao nhiên liệu',
      transmission: 'Hộp số truyền động',
      yHeight: 'Chiều cao yên xe',
      tankCapacity: 'Dung tích bình xăng',
      frame: 'Chất liệu khung sườn',
      fork: 'Chất liệu phuộc trước',
      groupset: 'Bộ đề truyền động',
      wheels: 'Kích cỡ vành/bánh'
    };
    return labels[key] || key;
  };

  // Map the active slide index to the correct dot index (1-indexed for slides)
  const getActiveDotIndex = () => {
    if (!hasMultipleImages) return 0;
    if (currentIndex === 0) return images.length - 1;
    if (currentIndex === slides.length - 1) return 0;
    return currentIndex - 1;
  };

  return (
    <div className={`sheet-overlay active`} onClick={onClose}>
      <div 
        ref={sheetRef}
        className="bottom-sheet" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" onClick={onClose} />
        
        <div className="sheet-header">
          <div>
            <div className="product-brand" style={{ fontSize: '12px' }}>
              {product.brand} • {getVehicleTypeLabel(product.type)}
            </div>
            <h2 className="product-name" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
              {product.name}
            </h2>
            <div className="product-pricing" style={{ marginBottom: 0 }}>
              {product.priceMode === 'normal' && (
                <span className="price-current" style={{ fontSize: '1.2rem' }}>
                  {formatPrice(product.price)}
                </span>
              )}
              {product.priceMode === 'sale' && (
                <>
                  <span className="price-current sale" style={{ fontSize: '1.2rem' }}>
                    {formatPrice(product.price)}
                  </span>
                  <span className="price-original" style={{ fontSize: '0.9rem' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                </>
              )}
              {product.priceMode === 'contact' && (
                <span className="price-contact" style={{ fontSize: '1.1rem' }}>Giá liên hệ</span>
              )}
              {product.priceMode === 'hidden' && (
                <span className="price-hidden" style={{ fontSize: '0.95rem' }}>Giá: Hộp thư / Inbox</span>
              )}
            </div>
          </div>
          <button className="sheet-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="sheet-body" style={{ padding: '16px 20px' }}>
          
          {/* UPGRADED INFINITE TOUCH CAROUSEL - CENTERED PEEKING DESIGN */}
          <div 
            className="carousel-viewport"
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              overflow: 'hidden',
              background: '#f1f3f4',
              userSelect: 'none',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            {/* Slider track */}
            <div 
              ref={sliderTrackRef}
              onTransitionEnd={handleTransitionEnd}
              style={{
                display: 'flex',
                gap: '12px',
                width: '100%',
                height: '100%',
                transform: hasMultipleImages 
                  ? `translate3d(calc(8% - ${currentIndex} * (84% + 12px) + ${touchMoveOffset}px), 0, 0)`
                  : 'translate3d(0, 0, 0)',
                transition: isTransitioning ? 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
              }}
            >
              {slides.map((slideUrl, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div 
                    key={idx} 
                    style={{
                      flexShrink: 0,
                      width: hasMultipleImages ? '84%' : '100%',
                      height: '100%',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s ease',
                      opacity: hasMultipleImages && !isActive ? 0.6 : 1,
                      transform: hasMultipleImages && !isActive ? 'scale(0.94)' : 'scale(1)'
                    }}
                  >
                    <img 
                      src={slideUrl} 
                      alt={`${product.name} slide ${idx}`}
                      draggable="false"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none' // disable browser image dragging
                      }} 
                    />
                  </div>
                );
              })}
            </div>

            {/* Slide indicators (Pagination Dots) */}
            {hasMultipleImages && (
              <>
                <div 
                  className="carousel-pagination-dots"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    zIndex: '10'
                  }}
                >
                  {images.map((_, idx) => {
                    const isActive = idx === getActiveDotIndex();
                    return (
                      <span 
                        key={idx}
                        style={{
                          width: isActive ? '18px' : '6px',
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: isActive ? 'white' : 'rgba(255, 255, 255, 0.45)',
                          transition: 'all 0.25s ease',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Left/Right manual click triggers for desktop accessibility */}
                <button 
                  onClick={handlePrev}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: '10',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNext}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: '10',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>


          <div className="sheet-description-section" style={{ marginTop: '16px' }}>
            {product.description.split('\n').map((para, i) => (
              <p key={i} className="sheet-description-paragraph" style={{ marginBottom: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {para}
              </p>
            ))}
            
            {/* Inline detailed photos in description section - Swipeable horizontal slider */}
            {images.length > 0 && (
              <div className="description-images-gallery-wrapper" style={{ marginTop: '24px' }}>
                <h4 className="sheet-section-title" style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                  Hình ảnh thực tế chi tiết (Vuốt sang hai bên)
                </h4>
                <div 
                  className="description-images-gallery" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    gap: '12px', 
                    overflowX: 'auto', 
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch', // smooth inertia on iOS
                    paddingBottom: '8px',
                    scrollbarWidth: 'none' // hide standard scrollbar in Firefox
                  }}
                >
                  {images.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className="description-image-container" 
                      style={{ 
                        flexShrink: 0,
                        width: '85%', // peeking visual cue
                        scrollSnapAlign: 'start',
                        borderRadius: 'var(--radius-md)', 
                        overflow: 'hidden', 
                        border: '1px solid var(--border)', 
                        background: '#f1f3f4', 
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                        <img 
                          src={imgUrl} 
                          alt={`${product.name} chi tiết ${idx + 1}`} 
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0, 0, 0, 0.65)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: '600',
                          backdropFilter: 'blur(4px)'
                        }}>
                          {idx + 1} / {images.length}
                        </div>
                      </div>
                      <div style={{ padding: '8px 12px', background: 'var(--surface-variant)', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', borderTop: '1px solid var(--border)', fontWeight: '600', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Hình ảnh {product.name} - Góc chụp chi tiết #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


          <div className="sheet-features-section" style={{ marginTop: '20px' }}>
            <h4 className="sheet-section-title">Thông số kỹ thuật chi tiết</h4>
            <div className="specs-grid">
              {Object.entries(product.specs).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div className="spec-box" key={key}>
                    <span className="spec-box-label">{getSpecLabel(key)}</span>
                    <span className="spec-box-value">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="sheet-features-section" style={{ marginTop: '20px' }}>
              <h4 className="sheet-section-title">Tính năng nổi bật</h4>
              <div className="features-list">
                {product.features.map((feature, idx) => (
                  <div className="feature-item" key={idx}>
                    <Check size={16} className="feature-check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sheet-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              onViewMap(product);
              onClose();
            }}
          >
            <MapPin size={16} />
            <span>Chỉ đường</span>
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => {
              onChatPress(product);
              onClose();
            }}
          >
            <MessageSquare size={16} />
            <span>Hỏi về xe</span>
          </button>
          
          <a 
            href={`tel:${shopPhone}`} 
            className="btn btn-call" 
            style={{ textDecoration: 'none' }}
          >
            <Phone size={16} />
            <span>Gọi ngay</span>
          </a>
        </div>
      </div>
    </div>
  );
}

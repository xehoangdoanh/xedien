import React from 'react';
import { Phone, MessageCircle, X, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function ChatBox({ 
  chatEnabled, 
  shopPhone, 
  shopName, 
  activeProductAttachment, 
  setActiveProductAttachment
}) {
  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getCleanPhone = (phone) => {
    return phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
  };

  const cleanPhone = getCleanPhone(shopPhone);

  if (!chatEnabled) {
    return (
      <div className="chat-disabled-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px', textAlign: 'center' }}>
        <div className="chat-disabled-icon" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(217, 48, 37, 0.1)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Phone size={32} />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>Tổng đài hỗ trợ trực tiếp</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', maxWidth: '280px', lineHeight: 1.5 }}>
          Hệ thống Chat trực tuyến hiện đang tạm đóng. Quý khách vui lòng gọi điện trực tiếp hoặc liên hệ qua Zalo để được tư vấn nhanh nhất.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
          <a href={`tel:${cleanPhone}`} className="btn btn-call" style={{ textDecoration: 'none', height: '44px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
            <Phone size={18} />
            <span>Gọi Hotline: {shopPhone}</span>
          </a>
          
          <a 
            href={`https://zalo.me/${cleanPhone}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary" 
            style={{ textDecoration: 'none', background: '#0068ff', color: 'white', height: '44px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', border: 'none' }}
          >
            <MessageCircle size={18} />
            <span>Liên hệ qua Chat Zalo</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '16px' }}>
      
      {/* Upper Brand Info Card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-container)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
          <HeartHandshake size={32} />
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Hỗ Trợ Khách Hàng 24/7</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          Chào mừng bạn đến với <strong>{shopName}</strong>. Chúng tôi luôn sẵn sàng hỗ trợ tư vấn báo giá xe, trả góp và thông tin đại lý tốt nhất.
        </p>
      </div>

      {/* Center Attachment or Guide Card */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '20px 0' }}>
        {activeProductAttachment ? (
          <div style={{ background: 'var(--surface-variant)', border: '1.5px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '14px', position: 'relative' }}>
            <button 
              onClick={() => setActiveProductAttachment(null)}
              style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              title="Gỡ đính kèm"
            >
              <X size={16} />
            </button>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>
              Xe bạn đang quan tâm:
            </span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img 
                src={activeProductAttachment.image} 
                alt={activeProductAttachment.name} 
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', background: '#eee' }} 
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeProductAttachment.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                  {activeProductAttachment.priceMode === 'contact' 
                    ? 'Giá liên hệ' 
                    : activeProductAttachment.priceMode === 'hidden'
                      ? 'Giá inbox'
                      : formatPrice(activeProductAttachment.price)}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: 1.4, fontStyle: 'italic' }}>
              * Khi nhấn nút Chat Zalo ở dưới, hệ thống sẽ đưa bạn đến Zalo của cửa hàng. Bạn vui lòng gửi kèm thông tin dòng xe này để chúng tôi tư vấn báo giá lăn bánh nhé!
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} style={{ color: 'var(--secondary)' }} />
                <span>Bảo mật 100%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} style={{ color: 'var(--secondary)' }} />
                <span>Phản hồi dưới 1 phút</span>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Bạn có thể hỏi bất kỳ thông tin nào về thủ tục mua xe trả góp, chương trình khuyến mãi, đăng ký biển số hoặc hẹn lịch chạy thử xe.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: 'auto' }}>
        <a 
          href={`https://zalo.me/${cleanPhone}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-secondary" 
          style={{ 
            textDecoration: 'none', 
            background: 'linear-gradient(135deg, #0068ff 0%, #0a56c6 100%)', 
            color: 'white', 
            height: '46px', 
            borderRadius: '23px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px', 
            fontWeight: 700, 
            fontSize: '0.95rem', 
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 104, 255, 0.25)',
            transition: 'transform 0.2s'
          }}
        >
          <MessageCircle size={20} />
          <span>Nhắn Tin Qua Zalo Ngay</span>
        </a>

        <a 
          href={`tel:${cleanPhone}`} 
          className="btn btn-call" 
          style={{ 
            textDecoration: 'none', 
            height: '46px', 
            borderRadius: '23px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px', 
            fontWeight: 700, 
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
          }}
        >
          <Phone size={20} />
          <span>Gọi Tổng Đài: {shopPhone}</span>
        </a>
        
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '4px' }}>
          Hệ thống sẽ mở ứng dụng Zalo hoặc trình quản lý cuộc gọi trên điện thoại của bạn
        </span>
      </div>

    </div>
  );
}

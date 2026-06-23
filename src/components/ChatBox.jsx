import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MessageCircle, X } from 'lucide-react';
import { insertMessageToSupabase } from '../utils/supabaseClient';
import { sendChatNotification } from '../utils/chatNotifier';

export default function ChatBox({ 
  messages, 
  setMessages, 
  chatEnabled, 
  shopPhone, 
  shopName, 
  activeProductAttachment, 
  setActiveProductAttachment,
  chatSessionId
}) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && !activeProductAttachment) return;

    const newMessage = {
      id: Date.now(),
      sender: 'customer',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      attachedProduct: activeProductAttachment ? {
        id: activeProductAttachment.id,
        name: activeProductAttachment.name,
        price: activeProductAttachment.price,
        priceMode: activeProductAttachment.priceMode,
        image: (activeProductAttachment.images && activeProductAttachment.images[0]) || activeProductAttachment.image
      } : null,
      session_id: chatSessionId
    };

    setInputValue('');
    setActiveProductAttachment(null);

    // Trigger real-time notifications to Telegram/Zalo (fire-and-forget)
    sendChatNotification(newMessage, shopName).catch(err => {
      console.error('Error triggering chat notification:', err);
    });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {

      try {
        await insertMessageToSupabase(supabaseUrl, supabaseAnonKey, newMessage);
        setMessages([...messages, newMessage]);
      } catch (err) {
        console.error('Error inserting message to Supabase:', err);
        // Fallback to local storage
        setMessages([...messages, newMessage]);
      }
    } else {
      setMessages([...messages, newMessage]);
      
      // Simulate Shop Auto-Reply to make the prototype interactive when tested locally without DB
      setTimeout(() => {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'customer') {
            return [
              ...prev,
              {
                id: Date.now() + 1,
                sender: 'shop',
                text: `Chào bạn! Cửa hàng ${shopName} đã nhận được câu hỏi về ${
                  newMessage.attachedProduct ? `xe "${newMessage.attachedProduct.name}"` : 'sản phẩm'
                }. Chúng tôi sẽ phản hồi chi tiết tới bạn trong giây lát. Để được hỗ trợ nhanh nhất, bạn cũng có thể bấm gọi Hotline ở góc màn hình nhé!`,
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                session_id: chatSessionId
              }
            ];
          }
          return prev;
        });
      }, 4000);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!chatEnabled) {
    return (
      <div className="chat-disabled-state">
        <div className="chat-disabled-icon">
          <Phone size={36} />
        </div>
        <h3 style={{ fontWeight: 700 }}>Tổng đài hỗ trợ trực tiếp</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '280px' }}>
          Hệ thống Chat trực tuyến hiện đang bảo trì. Quý khách vui lòng gọi điện trực tiếp hoặc chat qua Zalo để được tư vấn nhanh nhất.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px', marginTop: '16px' }}>
          <a href={`tel:${shopPhone}`} className="btn btn-call" style={{ textDecoration: 'none' }}>
            <Phone size={18} />
            <span>Gọi Hotline: {shopPhone}</span>
          </a>
          
          <a 
            href={`https://zalo.me/${shopPhone}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary" 
            style={{ textDecoration: 'none', background: '#0068ff', color: 'white' }}
          >
            <MessageCircle size={18} />
            <span>Liên hệ qua Chat Zalo</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header-bar">
        <div className="chat-partner-info">
          <div className="status-dot" />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tư vấn viên {shopName}</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Đang hoạt động trực tuyến</span>
          </div>
        </div>
        <div className="chat-toggle-pill">Hỗ trợ 24/7</div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-secondary)', padding: '24px' }}>
            <MessageCircle size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
            <p style={{ fontSize: '0.85rem' }}>Chào bạn! Vui lòng đặt câu hỏi, chúng tôi sẽ hỗ trợ giải đáp mọi thắc mắc về xe máy, xe đạp, xe điện.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              {msg.attachedProduct && (
                <div className="message-attachment-card">
                  <img src={msg.attachedProduct.image} alt={msg.attachedProduct.name} className="attachment-img" />
                  <div>
                    <div className="attachment-title">{msg.attachedProduct.name}</div>
                    <div className="attachment-price">
                      {msg.attachedProduct.priceMode === 'normal' || msg.attachedProduct.priceMode === 'sale'
                        ? formatPrice(msg.attachedProduct.price)
                        : msg.attachedProduct.priceMode === 'contact' ? 'Giá liên hệ' : 'Giá nhắn tin'}
                    </div>
                  </div>
                </div>
              )}
              <div>{msg.text}</div>
              <div className="message-time">{msg.timestamp}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {activeProductAttachment && (
        <div style={{ padding: '8px 16px', background: 'var(--surface-variant)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={(activeProductAttachment.images && activeProductAttachment.images[0]) || activeProductAttachment.image} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '4px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Đính kèm: {activeProductAttachment.name}</span>
          </div>
          <button 
            onClick={() => setActiveProductAttachment(null)}
            style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form className="chat-input-bar" onSubmit={handleSend}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập nội dung câu hỏi..." 
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/initialProducts';
import { useLocalStorage } from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import ProductCard from './components/ProductCard';
import ProductSheet from './components/ProductSheet';
import MapView from './components/MapView';
import ChatBox from './components/ChatBox';
import AdminPanel from './components/AdminPanel';
import ToastNotification from './components/ToastNotification';
import { MapPin, Search, Lock } from 'lucide-react';
import { fetchProductsFromSupabase, fetchMessagesFromSupabase, insertMessageToSupabase, fetchShopSettingsFromSupabase } from './utils/supabaseClient';

export default function App() {
  // Global States
  const [products, setProducts] = useLocalStorage('shop-products-v3', initialProducts);
  const [chatEnabled, setChatEnabled] = useLocalStorage('chat-enabled', true);
  const [shopSettings, setShopSettings] = useLocalStorage('shop-settings', {
    name: 'X-Điện Premium Hà Nội',
    phone: '0988777999',
    lat: 21.0125,
    lng: 105.8115,
    address: '102 Nguyễn Trãi, Thanh Xuân, Hà Nội'
  });
  
  const [conversations, setConversations] = useLocalStorage('chat-conversations', []);
  
  // Chat session ID unique for customer browser session
  const [chatSessionId] = useState(() => {
    let id = localStorage.getItem('chat-session-id');
    if (!id) {
      id = `cust-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('chat-session-id', id);
    }
    return id;
  });
  
  // App navigation
  const [activeTab, setActiveTab] = useState('catalog');
  
  // Interaction states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeProductAttachment, setActiveProductAttachment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fromGoogleMaps, setFromGoogleMaps] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  // Admin access control states
  const [isAdminModeEnabled, setIsAdminModeEnabled] = useLocalStorage('admin-mode-enabled', false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage('admin-authenticated', false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleVerifyPassword = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || '123456';
    if (inputPassword === correctPassword) {
      setIsAdminModeEnabled(true);
      setIsAdminAuthenticated(true);
      setPasswordError(false);
      setInputPassword('');
      setIsLoginModalOpen(false);
      setActiveTab('admin');
    } else {
      setPasswordError(true);
      setInputPassword('');
    }
  };

  // Google Sheets & Supabase loading & sync states
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Sync products from Supabase using environment variables
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      setLoadingProducts(true);
      fetchProductsFromSupabase(supabaseUrl, supabaseAnonKey)
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
            setFetchError(null);
          } else {
            throw new Error('Dữ liệu trả về không đúng định dạng');
          }
        })
        .catch(err => {
          console.error('Error fetching products from Supabase:', err);
          setFetchError(err.message || 'Không thể tải dữ liệu từ Supabase');
        })
        .finally(() => {
          setLoadingProducts(false);
        });
    } else {
      setFetchError(null);
      setLoadingProducts(false);
    }
  }, []);

  // Sync Shop Settings from Supabase
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return;

    fetchShopSettingsFromSupabase(supabaseUrl, supabaseAnonKey)
      .then(data => {
        if (data) {
          setShopSettings({
            name: data.name,
            phone: data.phone,
            lat: data.lat,
            lng: data.lng,
            address: data.address
          });
          setChatEnabled(data.chat_enabled);
        }
      })
      .catch(err => {
        console.warn('Could not sync shop settings from Supabase (Check if the "shop_settings" table is created):', err.message);
      });
  }, [setShopSettings, setChatEnabled]);

  // Sync messages from Supabase
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !chatEnabled) return;

    const fetchMessages = () => {
      // If admin authenticated, load ALL messages. Otherwise, load only this session's messages.
      const fetchSessionId = isAdminAuthenticated ? null : chatSessionId;
      fetchMessagesFromSupabase(supabaseUrl, supabaseAnonKey, fetchSessionId)
        .then(data => {
          if (Array.isArray(data)) {
            setConversations(data);
          }
        })
        .catch(err => {
          // Silent catch to avoid spamming the console on first-time setup when table doesn't exist yet
          console.warn('Could not sync chat messages with Supabase (Check if the "messages" table is created):', err.message);
        });
    };

    // Fetch immediately on mount/state change, then poll
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalId);
  }, [chatEnabled, isAdminAuthenticated, chatSessionId]);

  // Check if opened from Google Maps reference in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('utm_source') === 'googlemaps' || params.get('ref') === 'googlemaps' || params.get('source') === 'map') {
      setFromGoogleMaps(true);
    }
  }, []);

  // Calculate unread chat messages for customer (messages from shop)
  const getCustomerUnreadCount = () => {
    if (!chatEnabled) return 0;
    // For client, count unread if the last message in conversations is from shop
    if (conversations.length === 0) return 0;
    const lastMsg = conversations[conversations.length - 1];
    return lastMsg.sender === 'shop' ? 1 : 0;
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleChatPress = (product) => {
    if (!product) return;

    const cleanPhone = shopSettings.phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const priceText = product.priceMode === 'contact' 
      ? 'Giá liên hệ' 
      : product.priceMode === 'hidden'
        ? 'Giá inbox'
        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

    const messageText = `Chào shop, tôi muốn nhận tư vấn báo giá lăn bánh và khuyến mãi cho mẫu xe: ${product.name} (${priceText}).`;

    // Copy to clipboard with fallback
    const copyToClipboard = (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    };

    const fallbackCopy = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.warn('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    };

    copyToClipboard(messageText);

    // Open Zalo immediately in a new window/tab
    const encodedText = encodeURIComponent(messageText);
    const zaloUrl = `https://zalo.me/${cleanPhone}?text=${encodedText}&msg=${encodedText}&message=${encodedText}`;
    window.open(zaloUrl, '_blank');
  };

  const handleViewMap = (product) => {
    setActiveTab('map');
  };

  // Filter products by category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* simulated device layout wrapper */}
      
      {/* Top Header */}
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo-container">
          <MapPin size={22} style={{ color: 'var(--primary)' }} />
          <h1 className="logo-text" style={{ fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }} title={shopSettings.name}>{shopSettings.name}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="theme-badge">
            {activeTab === 'catalog' && 'Cửa hàng'}
            {activeTab === 'map' && 'Bản đồ'}
            {activeTab === 'chat' && 'Hỗ trợ'}
            {activeTab === 'admin' && 'Quản lý'}
          </div>
          <button 
            onClick={() => {
              if (isAdminAuthenticated) {
                setActiveTab('admin');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px', borderRadius: '50%', transition: 'all 0.2s' }}
            title={isAdminAuthenticated ? "Vào trang Quản lý" : "Đăng nhập Admin"}
          >
            <Lock size={18} style={{ color: isAdminAuthenticated ? 'var(--primary)' : 'var(--text-secondary)' }} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-content">
        
        {/* TAB 1: VEHICLE CATALOG */}
        {activeTab === 'catalog' && (
          <div>
            {/* Google Maps Entrance Alert */}
            {fromGoogleMaps && (
              <div className="welcome-banner">
                <div className="welcome-title">
                  <MapPin size={18} />
                  <span>Chào mừng bạn từ Google Maps! 🗺️</span>
                </div>
                <p className="welcome-desc">
                  Cửa hàng của chúng tôi chỉ cách vị trí của bạn vài phút đi xe máy. Bạn được tặng ngay <strong> voucher 500.000đ </strong> khi ghé xem xe và mua trực tiếp tại địa điểm này!
                </p>
                <button 
                  className="btn btn-secondary" 
                  style={{ height: '32px', fontSize: '12px', padding: '0 8px', alignSelf: 'flex-start' }}
                  onClick={() => setActiveTab('map')}
                >
                  Xem chỉ đường & Khoảng cách
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="search-box-container">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm xe máy, xe điện, xe đạp thể thao..." 
                  className="search-input"
                />
              </div>
            </div>

            {/* Category Chips Scroll */}
            <div className="category-scroll">
              <button 
                className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Tất cả xe
              </button>
              <button 
                className={`category-chip ${selectedCategory === 'emotorbike' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('emotorbike')}
              >
                Xe máy điện
              </button>
              <button 
                className={`category-chip ${selectedCategory === 'ebike' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('ebike')}
              >
                Xe đạp điện
              </button>
              <button 
                className={`category-chip ${selectedCategory === 'motorbike' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('motorbike')}
              >
                Xe máy xăng
              </button>
              <button 
                className={`category-chip ${selectedCategory === 'bicycle' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('bicycle')}
              >
                Xe đạp thể thao
              </button>
            </div>

            {/* Sync Status Banner */}
            {fetchError && (
              <div style={{ margin: '12px 16px 0 16px', padding: '12px', background: 'rgba(217, 48, 37, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--error)', fontSize: '1.2rem', lineHeight: 1 }}>⚠</span>
                <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text)' }}>
                  <strong>Lỗi đồng bộ Supabase:</strong> {fetchError}. Đang hiển thị dữ liệu đã lưu gần nhất.
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loadingProducts ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', gap: '12px' }}>
                <div className="spinner-large"></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Đang tải danh sách xe từ Supabase...</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-secondary)' }}>
                Không tìm thấy chiếc xe nào phù hợp. Vui lòng nhập từ khóa khác!
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelect={handleProductSelect}
                    onChatPress={handleChatPress}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GOOGLE MAP VIEW */}
        {activeTab === 'map' && (
          <MapView 
            shopCoordinates={{ lat: shopSettings.lat, lng: shopSettings.lng }}
            shopAddress={shopSettings.address}
            shopName={shopSettings.name}
          />
        )}

        {/* TAB 3: CUSTOMER CHAT BOX */}
        {activeTab === 'chat' && (
          <ChatBox 
            messages={conversations}
            setMessages={setConversations}
            chatEnabled={chatEnabled}
            shopPhone={shopSettings.phone}
            shopName={shopSettings.name}
            activeProductAttachment={activeProductAttachment}
            setActiveProductAttachment={setActiveProductAttachment}
            chatSessionId={chatSessionId}
          />
        )}

        {/* TAB 4: SHOP ADMIN PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel 
            products={products}
            setProducts={setProducts}
            chatEnabled={chatEnabled}
            setChatEnabled={setChatEnabled}
            shopSettings={shopSettings}
            setShopSettings={setShopSettings}
            conversations={conversations}
            setConversations={setConversations}
            activeChatUser={activeChatUser}
            setActiveChatUser={setActiveChatUser}
            setActiveTab={setActiveTab}
            onLogout={() => {
              setIsAdminAuthenticated(false);
              setIsAdminModeEnabled(false);
              setActiveTab('catalog');
            }}
          />
        )}

      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If customer opens chat, clear unread simulation (mark last message read)
          // In this prototype, just opening the tab registers as read.
        }}
        chatEnabled={chatEnabled}
        unreadCount={getCustomerUnreadCount()}
        isAdminModeEnabled={isAdminModeEnabled}
      />

      {/* iOS sliding sheet for detailed view */}
      {selectedProduct && (
        <ProductSheet 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onChatPress={handleChatPress}
          onViewMap={handleViewMap}
          shopPhone={shopSettings.phone}
        />
      )}

      {/* In-app floating message notification for the owner when on customer catalog/maps tab */}
      <ToastNotification 
        conversations={conversations}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--surface)', padding: '28px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', width: '100%', maxWidth: '340px', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <button 
              onClick={() => {
                setIsLoginModalOpen(false);
                setPasswordError(false);
                setInputPassword('');
              }}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
            >
              ✕
            </button>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Lock size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px 0', textTransform: 'uppercase', color: 'var(--text)' }}>🔐 Xác Thực Quản Trị</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nhập mật khẩu để truy cập trang quản lý</span>
            </div>
            <form onSubmit={handleVerifyPassword} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <div className="form-group">
                <input 
                  type="password" 
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Nhập mã PIN hoặc mật khẩu..."
                  className="form-input"
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '16px' }}
                  autoFocus
                />
              </div>
              {passwordError && (
                <div style={{ fontSize: '0.75rem', color: 'var(--error)', textAlign: 'center', fontWeight: 600 }}>
                  Mật khẩu không đúng. Vui lòng thử lại!
                </div>
              )}
              <button 
                id="btn-auth-access"
                type="submit" 
                className="btn btn-primary" 
                style={{ height: '40px', width: '100%', marginTop: '4px', fontWeight: 700 }}
              >
                Xác Thực Truy Cập
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

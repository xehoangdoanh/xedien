import React from 'react';
import { ShoppingBag, MapPin, MessageSquare, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, chatEnabled, unreadCount, isAdminModeEnabled }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`bottom-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
        onClick={() => setActiveTab('catalog')}
      >
        <span className="icon-wrapper">
          <ShoppingBag size={20} />
        </span>
        <span>Cửa hàng</span>
      </button>

      <button 
        className={`bottom-nav-item ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => setActiveTab('map')}
      >
        <span className="icon-wrapper">
          <MapPin size={20} />
        </span>
        <span>Bản đồ</span>
      </button>

      <button 
        className={`bottom-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
        onClick={() => setActiveTab('chat')}
      >
        <span className="icon-wrapper">
          <MessageSquare size={20} />
        </span>
        <span>{chatEnabled ? 'Hỗ trợ' : 'Liên hệ'}</span>
        {chatEnabled && unreadCount > 0 && (
          <span className="nav-badge">{unreadCount}</span>
        )}
      </button>

      {isAdminModeEnabled && (
        <button 
          className={`bottom-nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <span className="icon-wrapper">
            <Settings size={20} />
          </span>
          <span>Quản lý</span>
        </button>
      )}
    </nav>
  );
}

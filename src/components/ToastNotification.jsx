import React, { useEffect, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function ToastNotification({ conversations, activeTab, setActiveTab }) {
  const [visible, setVisible] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  // Play synthesized audio notification using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // Play a nice double-beep sound (iOS/Material style notification pitch)
      const playBeep = (time, pitch, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = ctx.currentTime;
      // Double high-pitched beep
      playBeep(now, 880, 0.12);
      playBeep(now + 0.15, 1200, 0.18);
    } catch (e) {
      console.warn('Audio Context failed to initialize:', e);
    }
  };

  useEffect(() => {
    if (conversations.length === 0) return;
    
    const latest = conversations[conversations.length - 1];
    
    // Trigger notification if:
    // 1. The message comes from the customer
    // 2. We haven't notified about this message ID already
    // 3. We are NOT currently viewing the chat thread in either customer Chat tab or Admin messages subtab
    const isFromCustomer = latest.sender === 'customer';
    const isNew = !lastMessage || lastMessage.id !== latest.id;
    const notViewingChat = activeTab !== 'chat' && activeTab !== 'admin';

    if (isFromCustomer && isNew) {
      setLastMessage(latest);
      
      if (notViewingChat) {
        setVisible(true);
        playNotificationSound();
        
        // Auto-dismiss after 6 seconds
        const timer = setTimeout(() => {
          setVisible(false);
        }, 6000);
        
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, activeTab]);

  if (!visible || !lastMessage) return null;

  return (
    <div 
      className="notification-banner"
      onClick={() => {
        setActiveTab('admin');
        setVisible(false);
        // Note: The App component will need to transition the admin panel subtab to messages
        // We will trigger a storage update or customized event if needed, but going to Admin tab is a great start
        window.dispatchEvent(new CustomEvent('open-admin-messages'));
      }}
    >
      <div className="notification-avatar">
        <MessageSquare size={18} />
      </div>
      
      <div className="notification-content">
        <div className="notification-title">Khách hàng nhắn tin:</div>
        <div className="notification-text">
          {lastMessage.attachedProduct ? `[Hỏi về ${lastMessage.attachedProduct.name}] ` : ''}
          {lastMessage.text}
        </div>
      </div>
      
      <button 
        className="notification-close"
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Utility to send real-time alerts to Telegram and Zalo Webhooks
// Works on client-side, triggered when customers send new chat messages.

export const sendChatNotification = async (message, shopName) => {
  // Load configuration from localStorage first (allows direct UI setup), fallback to env
  let telegramToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  let telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  let zaloWebhookUrl = import.meta.env.VITE_ZALO_WEBHOOK_URL;

  try {
    const savedSettings = JSON.parse(localStorage.getItem('shop-notification-settings') || '{}');
    if (savedSettings.telegramToken) telegramToken = savedSettings.telegramToken;
    if (savedSettings.telegramChatId) telegramChatId = savedSettings.telegramChatId;
    if (savedSettings.zaloWebhookUrl) zaloWebhookUrl = savedSettings.zaloWebhookUrl;
  } catch (e) {
    console.error('[Notifier] Failed to load notification settings from localStorage', e);
  }

  const productText = message.attachedProduct 
    ? `\n📦 Xe đang xem: ${message.attachedProduct.name} (${
        message.attachedProduct.priceMode === 'contact' 
          ? 'Giá liên hệ' 
          : `${new Intl.NumberFormat('vi-VN').format(message.attachedProduct.price)}đ`
      })`
    : '';

  const notificationText = `🔔 TIN NHẮN MỚI TỪ KHÁCH HÀNG
🏪 Cửa hàng: ${shopName}
👤 Định danh: Khách hàng #${message.session_id ? message.session_id.replace('cust-', '') : 'vô danh'}
💬 Nội dung: "${message.text}"${productText}
⏰ Thời gian: ${message.timestamp}`;

  // 1. Send to Telegram if configured
  if (telegramToken && telegramChatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: notificationText
        })
      });
      if (response.ok) {
        console.log('[Notifier] Sent alert to Telegram successfully');
      } else {
        console.warn('[Notifier] Telegram API returned status:', response.status);
      }
    } catch (e) {
      console.error('[Notifier] Failed to send Telegram alert:', e);
    }
  }

  // 2. Send to Zalo Webhook if configured
  if (zaloWebhookUrl) {
    try {
      const response = await fetch(zaloWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: notificationText,
          sender: message.sender,
          text: message.text,
          session_id: message.session_id,
          attachedProduct: message.attachedProduct,
          timestamp: message.timestamp,
          shopName: shopName
        })
      });
      if (response.ok) {
        console.log('[Notifier] Sent alert to Zalo webhook successfully');
      } else {
        console.warn('[Notifier] Zalo Webhook API returned status:', response.status);
      }
    } catch (e) {
      console.error('[Notifier] Failed to send Zalo webhook alert:', e);
    }
  }
};

export const sendTestNotification = async (type, config) => {
  const testMessageText = `🔔 TIN NHẮN THỬ NGHIỆM
🏪 Cửa hàng: ${config.shopName || 'Hệ thống Xe Điện'}
💬 Đây là tin nhắn kiểm tra kết nối thông báo tự động. Cấu hình của bạn hoạt động rất tốt!
⏰ Thời gian: ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

  if (type === 'telegram') {
    const { telegramToken, telegramChatId } = config;
    if (!telegramToken || !telegramChatId) {
      throw new Error('Thiếu thông tin Bot Token hoặc Chat ID');
    }
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: testMessageText
      })
    });
    if (!response.ok) {
      throw new Error(`Telegram API trả về lỗi (HTTP ${response.status})`);
    }
    return true;
  }

  if (type === 'zalo') {
    const { zaloWebhookUrl } = config;
    if (!zaloWebhookUrl) {
      throw new Error('Thiếu địa chỉ Webhook URL');
    }
    const response = await fetch(zaloWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: testMessageText,
        isTest: true,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        shopName: config.shopName || 'Hệ thống Xe Điện'
      })
    });
    if (!response.ok) {
      throw new Error(`Zalo Webhook trả về lỗi (HTTP ${response.status})`);
    }
    return true;
  }
};


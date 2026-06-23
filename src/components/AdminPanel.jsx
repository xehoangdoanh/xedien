import React, { useState, useEffect } from 'react';
import { ToggleLeft, Plus, Save, Trash2, Edit2, MessageSquare, MapPin, Store, Check, AlertCircle, Volume2 } from 'lucide-react';
import SpecImporter from './SpecImporter';
import { insertProductToSupabase, updateProductInSupabase, deleteProductFromSupabase, insertMessageToSupabase, updateShopSettingsInSupabase } from '../utils/supabaseClient';
import { sendTestNotification } from '../utils/chatNotifier';

export default function AdminPanel({ 
  products, 
  setProducts, 
  chatEnabled, 
  setChatEnabled, 
  shopSettings, 
  setShopSettings,
  conversations,
  setConversations,
  activeChatUser,
  setActiveChatUser,
  setActiveTab,
  onLogout
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('settings'); // settings, products, messages

  useEffect(() => {
    const handleOpenMessages = () => {
      setActiveAdminSubTab('messages');
      setActiveChatUser('Khách hàng vô danh');
    };
    window.addEventListener('open-admin-messages', handleOpenMessages);
    return () => window.removeEventListener('open-admin-messages', handleOpenMessages);
  }, [setActiveChatUser]);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('emotorbike');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formPriceMode, setFormPriceMode] = useState('normal');
  const [formImage, setFormImage] = useState(''); // Stores comma-separated images list
  const [formDescription, setFormDescription] = useState('');
  
  // Dynamic Specs Form State (Expanded)
  const [specBattery, setSpecBattery] = useState('');
  const [specBatteryType, setSpecBatteryType] = useState('');
  const [specRange, setSpecRange] = useState('');
  const [specMaxSpeed, setSpecMaxSpeed] = useState('');
  const [specPower, setSpecPower] = useState('');
  const [specMotorType, setSpecMotorType] = useState('');
  const [specTorque, setSpecTorque] = useState('');
  const [specBrakes, setSpecBrakes] = useState('');
  const [specTires, setSpecTires] = useState('');
  const [specWaterproof, setSpecWaterproof] = useState('');
  
  const [specEngine, setSpecEngine] = useState('');
  const [specEngineType, setSpecEngineType] = useState('');
  const [specFuel, setSpecFuel] = useState('');
  const [specTransmission, setSpecTransmission] = useState('');
  const [specYHeight, setSpecYHeight] = useState('');
  const [specTankCapacity, setSpecTankCapacity] = useState('');
  
  const [specFrame, setSpecFrame] = useState('');
  const [specFork, setSpecFork] = useState('');
  const [specGroupset, setSpecGroupset] = useState('');
  const [specWeight, setSpecWeight] = useState('');

  // Settings form state
  const [settingName, setSettingName] = useState(shopSettings.name || 'Cửa Hàng Xe Điện Hà Nội');
  const [settingPhone, setSettingPhone] = useState(shopSettings.phone || '0988777999');
  const [settingLat, setSettingLat] = useState(shopSettings.lat || 21.0125);
  const [settingLng, setSettingLng] = useState(shopSettings.lng || 105.8115);
  const [settingAddress, setSettingAddress] = useState(shopSettings.address || '102 Nguyễn Trãi, Thanh Xuân, Hà Nội');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [telegramToken, setTelegramToken] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shop-notification-settings') || '{}');
      return saved.telegramToken || '';
    } catch { return ''; }
  });
  const [telegramChatId, setTelegramChatId] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shop-notification-settings') || '{}');
      return saved.telegramChatId || '';
    } catch { return ''; }
  });
  const [zaloWebhookUrl, setZaloWebhookUrl] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shop-notification-settings') || '{}');
      return saved.zaloWebhookUrl || '';
    } catch { return ''; }
  });

  const [telegramTestStatus, setTelegramTestStatus] = useState(null);
  const [telegramTestError, setTelegramTestError] = useState('');
  const [zaloTestStatus, setZaloTestStatus] = useState(null);
  const [zaloTestError, setZaloTestError] = useState('');

  // Syncing states
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isDeletingProductId, setIsDeletingProductId] = useState(null);

  // Chat message input for admin reply
  const [adminReplyText, setAdminReplyText] = useState('');

  // Sound notify toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reset form
  const resetForm = () => {
    setFormName('');
    setFormType('emotorbike');
    setFormBrand('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormPriceMode('normal');
    setFormImage('');
    setFormDescription('');
    
    // Clear all specs
    setSpecBattery('');
    setSpecBatteryType('');
    setSpecRange('');
    setSpecMaxSpeed('');
    setSpecPower('');
    setSpecMotorType('');
    setSpecTorque('');
    setSpecBrakes('');
    setSpecTires('');
    setSpecWaterproof('');
    
    setSpecEngine('');
    setSpecEngineType('');
    setSpecFuel('');
    setSpecTransmission('');
    setSpecYHeight('');
    setSpecTankCapacity('');
    
    setSpecFrame('');
    setSpecFork('');
    setSpecGroupset('');
    setSpecWeight('');
    
    setEditingProductId(null);
  };

  // Populate form with imported data from SpecImporter
  const handleImportComplete = (scrapedData) => {
    setFormName(scrapedData.name);
    setFormType(scrapedData.type);
    setFormBrand(scrapedData.brand);
    
    // Load images array as comma separated string
    if (scrapedData.images && scrapedData.images.length > 0) {
      setFormImage(scrapedData.images.join(', '));
    } else {
      setFormImage(scrapedData.image || '');
    }
    
    setFormDescription(scrapedData.description);
    setFormPriceMode(scrapedData.priceMode);
    
    // Clear first, then load specs
    setSpecBattery(''); setSpecBatteryType(''); setSpecRange(''); setSpecMaxSpeed(''); setSpecPower('');
    setSpecMotorType(''); setSpecTorque(''); setSpecBrakes(''); setSpecTires(''); setSpecWaterproof('');
    setSpecEngine(''); setSpecEngineType(''); setSpecFuel(''); setSpecTransmission(''); setSpecYHeight('');
    setSpecTankCapacity(''); setSpecFrame(''); setSpecFork(''); setSpecGroupset(''); setSpecWeight('');

    if (scrapedData.type === 'motorbike') {
      setSpecEngine(scrapedData.specs.engine || '');
      setSpecEngineType(scrapedData.specs.engineType || '');
      setSpecFuel(scrapedData.specs.fuelConsumption || '');
      setSpecTransmission(scrapedData.specs.transmission || '');
      setSpecTorque(scrapedData.specs.torque || '');
      setSpecPower(scrapedData.specs.power || '');
      setSpecBrakes(scrapedData.specs.brakes || '');
      setSpecTires(scrapedData.specs.tires || '');
      setSpecYHeight(scrapedData.specs.yHeight || '');
      setSpecTankCapacity(scrapedData.specs.tankCapacity || '');
      setSpecWeight(scrapedData.specs.weight || '');
    } else if (scrapedData.type === 'bicycle') {
      setSpecFrame(scrapedData.specs.frame || '');
      setSpecFork(scrapedData.specs.fork || '');
      setSpecGroupset(scrapedData.specs.groupset || '');
      setSpecBrakes(scrapedData.specs.brakes || '');
      setSpecTires(scrapedData.specs.tires || '');
      setSpecWeight(scrapedData.specs.weight || '');
    } else {
      // electric
      setSpecBattery(scrapedData.specs.battery || '');
      setSpecBatteryType(scrapedData.specs.batteryType || '');
      setSpecRange(scrapedData.specs.range || '');
      setSpecMaxSpeed(scrapedData.specs.maxSpeed || '');
      setSpecPower(scrapedData.specs.power || '');
      setSpecMotorType(scrapedData.specs.motorType || '');
      setSpecTorque(scrapedData.specs.torque || '');
      setSpecBrakes(scrapedData.specs.brakes || '');
      setSpecTires(scrapedData.specs.tires || '');
      setSpecWaterproof(scrapedData.specs.waterproof || '');
      setSpecWeight(scrapedData.specs.weight || '');
    }
  };

  // Submit product (Add or Edit)
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!formName || !formBrand) {
      alert('Vui lòng điền tên xe và hãng sản xuất!');
      return;
    }

    const priceNum = formPrice ? parseInt(formPrice, 10) : 0;
    const origPriceNum = formOriginalPrice ? parseInt(formOriginalPrice, 10) : null;

    // Parse image URLs list
    const imagesArr = formImage
      ? formImage.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    // Assemble specifications based on vehicle type
    let specsObj = {};
    if (formType === 'motorbike') {
      specsObj = {
        engine: specEngine || '110 cc',
        engineType: specEngineType || 'Xăng, 4 kỳ, xi-lanh đơn',
        fuelConsumption: specFuel || '1.8 lít/100km',
        transmission: specTransmission || 'Tự động vô cấp CVT',
        torque: specTorque || '9.0 Nm',
        power: specPower || '8.8 HP',
        brakes: specBrakes || 'Phanh đĩa trước, Phanh tang trống sau',
        tires: specTires || 'Lốp không săm',
        yHeight: specYHeight || '760 mm',
        tankCapacity: specTankCapacity || '5.0 Lít',
        weight: specWeight || '98 kg'
      };
    } else if (formType === 'bicycle') {
      specsObj = {
        frame: specFrame || 'Hợp kim nhôm',
        fork: specFork || 'Phuộc đơ hợp kim',
        groupset: specGroupset || 'Shimano 7 tốc độ',
        brakes: specBrakes || 'Phanh cơ chữ V',
        tires: specTires || '700x38c',
        weight: specWeight || '14 kg'
      };
    } else {
      // electric
      specsObj = {
        battery: specBattery || '48V-12Ah',
        batteryType: specBatteryType || 'Ắc quy axit-chì',
        range: specRange || '60 km / sạc',
        maxSpeed: specMaxSpeed || '35 km/h',
        power: specPower || '350 W',
        motorType: specMotorType || 'Động cơ Hub không chổi than',
        torque: specTorque || '40 Nm',
        brakes: specBrakes || 'Phanh tang trống trước sau',
        tires: specTires || '16 inch lốp có săm',
        waterproof: specWaterproof || 'Chống nước IPX5',
        weight: specWeight || '45 kg'
      };
    }

    const productData = {
      id: editingProductId || `vehicle-${Date.now()}`,
      name: formName,
      type: formType,
      brand: formBrand,
      price: priceNum,
      originalPrice: origPriceNum,
      priceMode: formPriceMode,
      images: imagesArr.length > 0 ? imagesArr : ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'],
      description: formDescription || `Mô tả chi tiết của dòng xe ${formName}`,
      specs: specsObj,
      features: ['Hàng chính hãng', 'Bảo hành uy tín', 'Thiết kế hiện đại']
    };

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      setIsSavingProduct(true);
      try {
        if (editingProductId) {
          await updateProductInSupabase(supabaseUrl, supabaseAnonKey, productData);
          setProducts(products.map(p => p.id === editingProductId ? productData : p));
          setEditingProductId(null);
        } else {
          await insertProductToSupabase(supabaseUrl, supabaseAnonKey, productData);
          setProducts([productData, ...products]);
        }
        resetForm();
        setShowAddForm(false);
      } catch (err) {
        console.error('Error saving product to Supabase:', err);
        alert('Lỗi kết nối khi lưu sản phẩm lên Supabase: ' + err.message);
      } finally {
        setIsSavingProduct(false);
      }
    } else {
      if (editingProductId) {
        setProducts(products.map(p => p.id === editingProductId ? productData : p));
        setEditingProductId(null);
      } else {
        setProducts([productData, ...products]);
      }
      resetForm();
      setShowAddForm(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormType(product.type);
    setFormBrand(product.brand);
    setFormPrice(product.price ? product.price.toString() : '');
    setFormOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setFormPriceMode(product.priceMode);
    
    // Load images array as comma separated string
    if (product.images && product.images.length > 0) {
      setFormImage(product.images.join(', '));
    } else {
      setFormImage(product.image || '');
    }
    
    setFormDescription(product.description || '');

    // Reset all specs first
    setSpecBattery(''); setSpecBatteryType(''); setSpecRange(''); setSpecMaxSpeed(''); setSpecPower('');
    setSpecMotorType(''); setSpecTorque(''); setSpecBrakes(''); setSpecTires(''); setSpecWaterproof('');
    setSpecEngine(''); setSpecEngineType(''); setSpecFuel(''); setSpecTransmission(''); setSpecYHeight('');
    setSpecTankCapacity(''); setSpecFrame(''); setSpecFork(''); setSpecGroupset(''); setSpecWeight('');

    // Load specs
    if (product.type === 'motorbike') {
      setSpecEngine(product.specs.engine || '');
      setSpecEngineType(product.specs.engineType || '');
      setSpecFuel(product.specs.fuelConsumption || '');
      setSpecTransmission(product.specs.transmission || '');
      setSpecTorque(product.specs.torque || '');
      setSpecPower(product.specs.power || '');
      setSpecBrakes(product.specs.brakes || '');
      setSpecTires(product.specs.tires || '');
      setSpecYHeight(product.specs.yHeight || '');
      setSpecTankCapacity(product.specs.tankCapacity || '');
      setSpecWeight(product.specs.weight || '');
    } else if (product.type === 'bicycle') {
      setSpecFrame(product.specs.frame || '');
      setSpecFork(product.specs.fork || '');
      setSpecGroupset(product.specs.groupset || '');
      setSpecBrakes(product.specs.brakes || '');
      setSpecTires(product.specs.tires || '');
      setSpecWeight(product.specs.weight || '');
    } else {
      setSpecBattery(product.specs.battery || '');
      setSpecBatteryType(product.specs.batteryType || '');
      setSpecRange(product.specs.range || '');
      setSpecMaxSpeed(product.specs.maxSpeed || '');
      setSpecPower(product.specs.power || '');
      setSpecMotorType(product.specs.motorType || '');
      setSpecTorque(product.specs.torque || '');
      setSpecBrakes(product.specs.brakes || '');
      setSpecTires(product.specs.tires || '');
      setSpecWaterproof(product.specs.waterproof || '');
      setSpecWeight(product.specs.weight || '');
    }

    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dòng xe này khỏi hệ thống?')) {
      return;
    }

    const targetProduct = products.find(p => p.id === id);
    if (!targetProduct) return;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      setIsDeletingProductId(id);
      try {
        await deleteProductFromSupabase(supabaseUrl, supabaseAnonKey, id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error deleting product from Supabase:', err);
        alert('Lỗi kết nối khi xóa sản phẩm khỏi Supabase: ' + err.message);
      } finally {
        setIsDeletingProductId(null);
      }
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleTestTelegram = async () => {
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      alert('Vui lòng nhập đầy đủ Bot Token và Chat ID trước khi thử nghiệm!');
      return;
    }
    setTelegramTestStatus('sending');
    setTelegramTestError('');
    try {
      await sendTestNotification('telegram', {
        telegramToken: telegramToken.trim(),
        telegramChatId: telegramChatId.trim(),
        shopName: settingName
      });
      setTelegramTestStatus('success');
      setTimeout(() => setTelegramTestStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setTelegramTestStatus('error');
      setTelegramTestError(err.message || 'Lỗi kết nối API Telegram');
    }
  };

  const handleTestZalo = async () => {
    if (!zaloWebhookUrl.trim()) {
      alert('Vui lòng nhập Webhook URL trước khi thử nghiệm!');
      return;
    }
    setZaloTestStatus('sending');
    setZaloTestError('');
    try {
      await sendTestNotification('zalo', {
        zaloWebhookUrl: zaloWebhookUrl.trim(),
        shopName: settingName
      });
      setZaloTestStatus('success');
      setTimeout(() => setZaloTestStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setZaloTestStatus('error');
      setZaloTestError(err.message || 'Lỗi gửi Webhook');
    }
  };

  const handleToggleChat = async (val) => {
    setChatEnabled(val);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        await updateShopSettingsInSupabase(supabaseUrl, supabaseAnonKey, {
          name: settingName,
          phone: settingPhone,
          lat: parseFloat(settingLat),
          lng: parseFloat(settingLng),
          address: settingAddress,
          chatEnabled: val
        });
      } catch (err) {
        console.warn('Could not save chat status to Supabase:', err.message);
      }
    }
  };

  const handleSaveSettings = async () => {
    const newSettings = {
      name: settingName,
      phone: settingPhone,
      lat: parseFloat(settingLat),
      lng: parseFloat(settingLng),
      address: settingAddress
    };

    setShopSettings(newSettings);
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        await updateShopSettingsInSupabase(supabaseUrl, supabaseAnonKey, {
          ...newSettings,
          chatEnabled
        });
      } catch (err) {
        console.warn('Could not save shop settings to Supabase:', err.message);
      }
    }
    
    // Lưu cấu hình Telegram/Zalo vào localStorage
    localStorage.setItem('shop-notification-settings', JSON.stringify({
      telegramToken: telegramToken.trim(),
      telegramChatId: telegramChatId.trim(),
      zaloWebhookUrl: zaloWebhookUrl.trim()
    }));

    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Reply to customer chat
  const handleSendAdminReply = async (e) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeChatUser) return;

    const newMessage = {
      id: Date.now(),
      sender: 'shop',
      text: adminReplyText.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      session_id: activeChatUser
    };

    setAdminReplyText('');

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        await insertMessageToSupabase(supabaseUrl, supabaseAnonKey, newMessage);
        setConversations([...conversations, newMessage]);
      } catch (err) {
        console.error('Error sending message to Supabase:', err);
        setConversations([...conversations, newMessage]);
      }
    } else {
      setConversations([...conversations, newMessage]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={22} style={{ color: 'var(--primary)' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`category-chip ${activeAdminSubTab === 'settings' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setActiveAdminSubTab('settings')}
          >
            Cấu hình
          </button>
          <button 
            className={`category-chip ${activeAdminSubTab === 'products' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setActiveAdminSubTab('products')}
          >
            Kho xe ({products.length})
          </button>
          <button 
            className={`category-chip ${activeAdminSubTab === 'messages' ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setActiveAdminSubTab('messages')}
          >
            Tin nhắn
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }} className="app-content">
        
        {/* SUBTAB 1: SETTINGS CONFIGURATION */}
        {activeAdminSubTab === 'settings' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <span>Thiết Lập Bản Đồ & Chat</span>
            </div>
            
            <div className="admin-settings-row">
              <div className="admin-settings-info">
                <span className="admin-settings-label">Bật/Tắt tính năng Chat</span>
                <span className="admin-settings-sub">Nếu tắt, khách sẽ gọi Hotline hoặc nhắn Zalo</span>
              </div>
              <label className="switch-control">
                <input 
                  type="checkbox" 
                  checked={chatEnabled} 
                  onChange={(e) => handleToggleChat(e.target.checked)} 
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="admin-settings-row">
              <div className="admin-settings-info">
                <span className="admin-settings-label">Báo âm thanh tin nhắn</span>
                <span className="admin-settings-sub">Đổ chuông bíp khi khách hỏi xe mới</span>
              </div>
              <label className="switch-control">
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={(e) => setSoundEnabled(e.target.checked)} 
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="admin-form" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div className="form-group">
                <label>Tên cửa hàng</label>
                <input 
                  type="text" 
                  value={settingName} 
                  onChange={(e) => setSettingName(e.target.value)} 
                  className="form-input"
                />
              </div>



              <div className="form-row-2">
                <div className="form-group">
                  <label>Hotline / Zalo</label>
                  <input 
                    type="text" 
                    value={settingPhone} 
                    onChange={(e) => setSettingPhone(e.target.value)} 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ hiển thị</label>
                  <input 
                    type="text" 
                    value={settingAddress} 
                    onChange={(e) => setSettingAddress(e.target.value)} 
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Vĩ độ GPS (Latitude)</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    value={settingLat} 
                    onChange={(e) => setSettingLat(e.target.value)} 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Kinh độ GPS (Longitude)</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    value={settingLng} 
                    onChange={(e) => setSettingLng(e.target.value)} 
                    className="form-input"
                  />
                </div>
              </div>

              {/* Notifications settings are now managed directly via personal Zalo/Hotline redirection - no webhook configuration required. */}

              <button 
                id="btn-save-settings"
                onClick={handleSaveSettings}
                className="btn btn-primary"
                style={{ 
                  height: '40px', 
                  marginTop: '8px', 
                  background: settingsSaved ? 'linear-gradient(135deg, var(--secondary) 0%, #15803d 100%)' : 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
                  boxShadow: settingsSaved ? '0 4px 12px rgba(21, 128, 61, 0.25)' : '0 4px 12px rgba(37, 99, 235, 0.25)',
                  borderRadius: '20px'
                }}
              >
                {settingsSaved ? (
                  <>
                    <Check size={16} />
                    <span>Đã lưu thành công!</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Lưu Cấu Hình Cửa Hàng</span>
                  </>
                )}
              </button>

              <button 
                id="btn-logout"
                onClick={onLogout}
                className="btn"
                style={{ 
                  height: '40px', 
                  marginTop: '12px', 
                  background: 'rgba(217, 48, 37, 0.03)', 
                  border: '1.5px solid var(--error)', 
                  color: 'var(--error)', 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(217, 48, 37, 0.05)'
                }}
              >
                <span>Đăng xuất khỏi Bảng điều khiển</span>
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 2: PRODUCT MANAGEMENT (KHO XE) */}
        {activeAdminSubTab === 'products' && (
          <div style={{ padding: '0 16px' }}>
            
            {!showAddForm ? (
              <button 
                id="btn-add-vehicle"
                onClick={() => { resetForm(); setShowAddForm(true); }}
                className="btn btn-primary"
                style={{ width: '100%', height: '40px', margin: '12px 0', borderRadius: '20px' }}
              >
                <Plus size={18} />
                <span>Thêm xe mới</span>
              </button>
            ) : (
              <div className="admin-section" style={{ margin: '12px 0' }}>
                <div className="admin-section-header">
                  <span>{editingProductId ? 'Sửa thông tin xe' : 'Thêm xe mới'}</span>
                  <button 
                    onClick={() => { resetForm(); setShowAddForm(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--error)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Hủy
                  </button>
                </div>

                {/* Integration of Smart Importer directly into Add Product Form */}
                <div style={{ padding: '12px 12px 0 12px' }}>
                  <SpecImporter onImportComplete={handleImportComplete} />
                </div>

                <form className="admin-form" onSubmit={handleSubmitProduct}>
                  <div className="form-group">
                    <label>Tên dòng xe *</label>
                    <input 
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ví dụ: VinFast Klara S 2026"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Loại xe</label>
                      <select 
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="form-select"
                      >
                        <option value="emotorbike">Xe máy điện</option>
                        <option value="ebike">Xe đạp điện</option>
                        <option value="motorbike">Xe máy thường</option>
                        <option value="bicycle">Xe đạp thể thao</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Hãng sản xuất *</label>
                      <input 
                        type="text" 
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        placeholder="Ví dụ: VinFast, Honda"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Chế độ hiển thị giá</label>
                      <select 
                        value={formPriceMode}
                        onChange={(e) => setFormPriceMode(e.target.value)}
                        className="form-select"
                      >
                        <option value="normal">Giá thường (Hiển thị 1 giá)</option>
                        <option value="sale">Khuyến mãi (Gạch giá cũ)</option>
                        <option value="contact">Giá liên hệ (Tư vấn trực tiếp)</option>
                        <option value="hidden">Ẩn giá (Chỉ hiển thị khi chat)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Danh sách hình ảnh (ngăn cách bằng dấu phẩy)</label>
                      <textarea 
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="Dán các đường dẫn ảnh, cách nhau bằng dấu phẩy..."
                        className="form-textarea"
                        style={{ height: '54px', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  {(formPriceMode === 'normal' || formPriceMode === 'sale' || formPriceMode === 'hidden') && (
                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Giá bán lẻ (VND) *</label>
                        <input 
                          type="number" 
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="Ví dụ: 25000000"
                          className="form-input"
                          required
                        />
                      </div>
                      
                      {formPriceMode === 'sale' && (
                        <div className="form-group">
                          <label>Giá gốc chưa giảm (VND) *</label>
                          <input 
                            type="number" 
                            value={formOriginalPrice}
                            onChange={(e) => setFormOriginalPrice(e.target.value)}
                            placeholder="Ví dụ: 28000000"
                            className="form-input"
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* DYNAMIC SPECS INPUTS ACCORDING TO VEHICLE TYPE */}
                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--surface-variant)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                      Thông số kỹ thuật ({formType === 'motorbike' ? 'Xe xăng' : formType === 'bicycle' ? 'Xe cơ' : 'Xe điện'})
                    </span>

                    {/* For Electric Bikes / Motorbikes */}
                    {(formType === 'emotorbike' || formType === 'ebike') && (
                      <>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Dung lượng Pin/Ắc quy</label>
                            <input type="text" value={specBattery} onChange={(e) => setSpecBattery(e.target.value)} placeholder="Ví dụ: Pin LFP 3.5 kWh" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Loại Pin/Ắc quy</label>
                            <input type="text" value={specBatteryType} onChange={(e) => setSpecBatteryType(e.target.value)} placeholder="Ví dụ: Pin sắt LFP" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Quãng đường / Sạc</label>
                            <input type="text" value={specRange} onChange={(e) => setSpecRange(e.target.value)} placeholder="Ví dụ: 150 km" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Tốc độ tối đa</label>
                            <input type="text" value={specMaxSpeed} onChange={(e) => setSpecMaxSpeed(e.target.value)} placeholder="Ví dụ: 78 km/h" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Công suất động cơ</label>
                            <input type="text" value={specPower} onChange={(e) => setSpecPower(e.target.value)} placeholder="Ví dụ: 3000 W" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Loại động cơ</label>
                            <input type="text" value={specMotorType} onChange={(e) => setSpecMotorType(e.target.value)} placeholder="Ví dụ: Động cơ Hub không chổi than" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Mô-men xoắn (Nm)</label>
                            <input type="text" value={specTorque} onChange={(e) => setSpecTorque(e.target.value)} placeholder="Ví dụ: 140 Nm" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Hệ thống phanh</label>
                            <input type="text" value={specBrakes} onChange={(e) => setSpecBrakes(e.target.value)} placeholder="Ví dụ: Phanh đĩa trước sau" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Kích thước lốp</label>
                            <input type="text" value={specTires} onChange={(e) => setSpecTires(e.target.value)} placeholder="Ví dụ: Lốp không săm 90/90-12" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Kháng nước</label>
                            <input type="text" value={specWaterproof} onChange={(e) => setSpecWaterproof(e.target.value)} placeholder="Ví dụ: IP67" className="form-input" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* For Traditional Gasoline Motorbikes */}
                    {formType === 'motorbike' && (
                      <>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Dung tích xi lanh</label>
                            <input type="text" value={specEngine} onChange={(e) => setSpecEngine(e.target.value)} placeholder="Ví dụ: 125 cc" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Kiểu động cơ</label>
                            <input type="text" value={specEngineType} onChange={(e) => setSpecEngineType(e.target.value)} placeholder="Ví dụ: eSP+, 4 kỳ, xi-lanh đơn" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Tiêu hao nhiên liệu</label>
                            <input type="text" value={specFuel} onChange={(e) => setSpecFuel(e.target.value)} placeholder="Ví dụ: 2.1L / 100km" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Hộp số truyền động</label>
                            <input type="text" value={specTransmission} onChange={(e) => setSpecTransmission(e.target.value)} placeholder="Ví dụ: Vô cấp CVT" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Mô-men xoắn cực đại</label>
                            <input type="text" value={specTorque} onChange={(e) => setSpecTorque(e.target.value)} placeholder="Ví dụ: 11.4 Nm" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Công suất tối đa</label>
                            <input type="text" value={specPower} onChange={(e) => setSpecPower(e.target.value)} placeholder="Ví dụ: 11 HP" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Hệ thống phanh</label>
                            <input type="text" value={specBrakes} onChange={(e) => setSpecBrakes(e.target.value)} placeholder="Ví dụ: Phanh đĩa trước, Phanh cơ sau" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Kích thước lốp</label>
                            <input type="text" value={specTires} onChange={(e) => setSpecTires(e.target.value)} placeholder="Ví dụ: Lốp không săm trước/sau" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Chiều cao yên</label>
                            <input type="text" value={specYHeight} onChange={(e) => setSpecYHeight(e.target.value)} placeholder="Ví dụ: 760 mm" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Dung tích bình xăng</label>
                            <input type="text" value={specTankCapacity} onChange={(e) => setSpecTankCapacity(e.target.value)} placeholder="Ví dụ: 6.0 Lít" className="form-input" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* For Bicycles */}
                    {formType === 'bicycle' && (
                      <>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Chất liệu Khung sườn</label>
                            <input type="text" value={specFrame} onChange={(e) => setSpecFrame(e.target.value)} placeholder="Ví dụ: Hợp kim nhôm" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Chất liệu Phuộc</label>
                            <input type="text" value={specFork} onChange={(e) => setSpecFork(e.target.value)} placeholder="Ví dụ: Phuộc đơ hợp kim nhôm" className="form-input" />
                          </div>
                        </div>
                        <div className="form-row-2">
                          <div className="form-group">
                            <label>Bộ đề / Truyền động</label>
                            <input type="text" value={specGroupset} onChange={(e) => setSpecGroupset(e.target.value)} placeholder="Ví dụ: Shimano 21 tốc độ" className="form-input" />
                          </div>
                          <div className="form-group">
                            <label>Hệ thống phanh</label>
                            <input type="text" value={specBrakes} onChange={(e) => setSpecBrakes(e.target.value)} placeholder="Ví dụ: Phanh đĩa cơ học" className="form-input" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Kích thước lốp / bánh</label>
                          <input type="text" value={specTires} onChange={(e) => setSpecTires(e.target.value)} placeholder="Ví dụ: Giant Escape 700x38c" className="form-input" />
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label>Khối lượng xe (kg)</label>
                      <input type="text" value={specWeight} onChange={(e) => setSpecWeight(e.target.value)} placeholder="Ví dụ: 110 kg" className="form-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Mô tả chi tiết</label>
                    <textarea 
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Mô tả các công nghệ nổi bật, thiết kế, thời hạn bảo hành của xe..."
                      className="form-textarea"
                    />
                  </div>

                  <button 
                    id="btn-publish-product"
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ height: '40px', marginTop: '8px' }} 
                    disabled={isSavingProduct}
                  >
                    {isSavingProduct ? (
                      <>
                        <span className="spinner-small" style={{ marginRight: '6px' }}></span>
                        <span>Đang đồng bộ với Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>{editingProductId ? 'Lưu chỉnh sửa' : 'Xuất bản sản phẩm'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* List of currently managed products */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Danh sách xe trong kho ({products.length})</span>
              
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: '12px', background: 'var(--surface)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', alignItems: 'center' }}>
                  <img src={(p.images && p.images[0]) || p.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', background: '#eee' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{p.brand} • {p.priceMode === 'contact' ? 'Giá liên hệ' : p.priceMode === 'hidden' ? 'Giá inbox' : `${new Intl.NumberFormat('vi-VN').format(p.price)}đ`}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => handleEditClick(p)} 
                      style={{ background: 'var(--primary-container)', color: 'var(--primary)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title="Sửa"
                    >
                      <Edit2 size={14} />
                    </button>
                     <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      disabled={isDeletingProductId === p.id}
                      style={{ background: 'rgba(217, 48, 37, 0.1)', color: 'var(--error)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: isDeletingProductId === p.id ? 0.5 : 1 }}
                      title="Xóa"
                    >
                      {isDeletingProductId === p.id ? (
                        <span className="spinner-small" style={{ borderColor: 'var(--error) transparent var(--error) transparent' }}></span>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SUBTAB 3: CUSTOMER MESSAGE INBOX (TIN NHẮN KHÁCH HÀNG) */}
        {activeAdminSubTab === 'messages' && (
          <div className="admin-section" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0, 104, 255, 0.1)', color: '#0068ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <MessageSquare size={26} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Chăm Sóc Khách Hàng Qua Zalo</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '320px', margin: '0 auto 20px auto' }}>
              Khách hàng khi nhấp nút liên hệ tư vấn trên trang web sẽ tự động mở ứng dụng Zalo để nhắn tin trực tiếp tới bạn.<br />
              Do đó, toàn bộ tin nhắn tư vấn sẽ được quản lý và thông báo đẩy trực tiếp, bảo mật trên ứng dụng Zalo cá nhân của bạn.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '280px', margin: '0 auto' }}>
              <a 
                href="https://chat.zalo.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary" 
                style={{ textDecoration: 'none', background: '#0068ff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '40px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', border: 'none' }}
              >
                Mở Zalo Web (chat.zalo.me)
              </a>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Bạn cũng có thể mở ứng dụng Zalo trên điện thoại để trả lời khách hàng tiện lợi hơn.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

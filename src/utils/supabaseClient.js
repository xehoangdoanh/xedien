// Supabase REST Client using standard Fetch API
// No npm dependencies, fully lightweight and compatible.

export const fetchProductsFromSupabase = async (url, anonKey) => {
  const cleanUrl = url.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/rest/v1/products?select=*&order=created_at.desc`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`Lỗi kết nối Supabase (HTTP ${response.status})`);
  }
  return response.json();
};

export const insertProductToSupabase = async (url, anonKey, product) => {
  const cleanUrl = url.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/rest/v1/products`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      id: product.id,
      name: product.name,
      type: product.type,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      priceMode: product.priceMode,
      images: product.images,
      description: product.description,
      specs: product.specs,
      features: product.features
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Thêm sản phẩm thất bại (HTTP ${response.status})`);
  }
  return response.json();
};

export const updateProductInSupabase = async (url, anonKey, product) => {
  const cleanUrl = url.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/rest/v1/products?id=eq.${product.id}`, {
    method: 'PATCH',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      name: product.name,
      type: product.type,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      priceMode: product.priceMode,
      images: product.images,
      description: product.description,
      specs: product.specs,
      features: product.features
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Cập nhật sản phẩm thất bại (HTTP ${response.status})`);
  }
  return response.json();
};

export const deleteProductFromSupabase = async (url, anonKey, id) => {
  const cleanUrl = url.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/rest/v1/products?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`Xóa sản phẩm thất bại (HTTP ${response.status})`);
  }
  return true;
};

export const fetchMessagesFromSupabase = async (url, anonKey, sessionId = null) => {
  const cleanUrl = url.replace(/\/$/, '');
  let fetchUrl = `${cleanUrl}/rest/v1/messages?select=*&order=created_at.asc`;
  if (sessionId) {
    fetchUrl = `${cleanUrl}/rest/v1/messages?select=*&session_id=eq.${sessionId}&order=created_at.asc`;
  }
  const response = await fetch(fetchUrl, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`Lỗi tải tin nhắn Supabase (HTTP ${response.status})`);
  }
  return response.json();
};

export const insertMessageToSupabase = async (url, anonKey, message) => {
  const cleanUrl = url.replace(/\/$/, '');
  const response = await fetch(`${cleanUrl}/rest/v1/messages`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      id: message.id,
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp,
      attachedProduct: message.attachedProduct,
      session_id: message.session_id
    })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Gửi tin nhắn thất bại (HTTP ${response.status})`);
  }
  return response.json();
};

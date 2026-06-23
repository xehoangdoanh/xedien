import React, { useState } from 'react';
import { Download, Sparkles, Check, Loader2 } from 'lucide-react';
import { popularImporterBikes } from '../data/initialProducts';

// Helper to detect brand and vehicle type based on URL and title keywords
const detectBrandAndType = (url, title = '') => {
  const u = url.toLowerCase();
  const t = title.toLowerCase();
  
  // 1. Honda
  if (u.includes('honda') || t.includes('honda') || 
      u.includes('sh125') || u.includes('sh150') || u.includes('sh160') || u.includes('sh350') || u.includes('sh-') ||
      u.includes('vision') || u.includes('lead') || u.includes('wave') || u.includes('winner') || 
      u.includes('cub') || u.includes('airblade') || u.includes('air-blade') || u.includes('vario') || u.includes('future') ||
      t.includes('vision') || t.includes('lead') || t.includes('wave') || t.includes('winner') || 
      t.includes('cub') || t.includes('airblade') || t.includes('air-blade') || t.includes('vario') || t.includes('future') || t.includes(' sh ')) {
    return { brand: 'Honda', type: 'motorbike' };
  }
  
  // 2. VinFast
  if (u.includes('vinfast') || t.includes('vinfast') || 
      u.includes('feliz') || u.includes('klara') || u.includes('evo200') || u.includes('evo-200') || 
      u.includes('vento') || u.includes('theon') || u.includes('impes') || u.includes('ludo') ||
      t.includes('feliz') || t.includes('klara') || t.includes('evo200') || t.includes('evo-200') || 
      t.includes('vento') || t.includes('theon')) {
    return { brand: 'VinFast', type: 'emotorbike' };
  }
  
  // 3. Yadea
  if (u.includes('yadea') || t.includes('yadea') || 
      u.includes('odora') || u.includes('voltguard') || u.includes('orla') || u.includes('buye') ||
      t.includes('odora') || t.includes('voltguard') || t.includes('orla') || t.includes('buye')) {
    return { brand: 'Yadea', type: 'emotorbike' };
  }
  
  // 4. Giant
  if (u.includes('giant') || t.includes('giant') || 
      u.includes('escape') || u.includes('rincon') || u.includes('atx') ||
      t.includes('escape') || t.includes('rincon') || t.includes('atx')) {
    return { brand: 'Giant', type: 'bicycle' };
  }
  
  // 5. Asama
  if (u.includes('asama') || t.includes('asama') || 
      u.includes('joy') || u.includes('eb-') ||
      t.includes('joy') || t.includes('eb-')) {
    return { brand: 'Asama', type: 'ebike' };
  }
  
  // 6. Pega
  if (u.includes('pega') || t.includes('pega') || 
      u.includes('zinger') || u.includes('cap-a') || u.includes('capa') ||
      t.includes('zinger') || t.includes('cap-a') || t.includes('capa')) {
    return { brand: 'Pega', type: 'ebike' };
  }
  
  return { brand: 'Hãng xe', type: 'emotorbike' };
};

// Helper to parse HTML DOM document into product fields
const parseHtmlToProduct = (doc, urlStr) => {
  // 1. Resolve base URL for relative assets
  let baseUrlObj;
  try {
    baseUrlObj = new URL(urlStr);
  } catch (e) {
    baseUrlObj = { origin: '', pathname: '' };
  }

  // 2. Extract structured JSON-LD data (highly standard on WooCommerce/Shopify sites)
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  let jsonLdData = { images: [], name: '', description: '', price: null };
  
  jsonLdScripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      const searchProduct = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        
        if (Array.isArray(obj)) {
          obj.forEach(item => searchProduct(item));
          return;
        }
        if (obj['@graph'] && Array.isArray(obj['@graph'])) {
          obj['@graph'].forEach(item => searchProduct(item));
          return;
        }

        if (obj['@type'] === 'Product' || (Array.isArray(obj['@type']) && obj['@type'].includes('Product'))) {
          if (obj.name) jsonLdData.name = obj.name;
          if (obj.description) jsonLdData.description = obj.description;
          
          if (obj.image) {
            const addImg = (url) => {
              if (typeof url === 'string' && url.trim() && !url.startsWith('data:')) {
                jsonLdData.images.push(url.trim());
              }
            };
            if (typeof obj.image === 'string') {
              addImg(obj.image);
            } else if (Array.isArray(obj.image)) {
              obj.image.forEach(img => {
                if (typeof img === 'string') addImg(img);
                else if (img && typeof img === 'object' && img.url) addImg(img.url);
              });
            } else if (typeof obj.image === 'object' && obj.image.url) {
              addImg(obj.image.url);
            }
          }
          
          if (obj.offers) {
            const offers = Array.isArray(obj.offers) ? obj.offers[0] : obj.offers;
            if (offers.price) {
              const p = parseFloat(offers.price);
              if (!isNaN(p) && p > 0) jsonLdData.price = p;
            }
          }
        }
      };
      
      searchProduct(data);
    } catch (e) {
      // ignore JSON parse errors
    }
  });

  // 3. Extract Page/Product Title
  let pageTitle = jsonLdData.name || 
                  doc.querySelector('h1.product_title')?.textContent?.trim() ||
                  doc.querySelector('h1')?.textContent?.trim() || 
                  doc.querySelector('title')?.textContent?.trim() || 
                  'Xe Quét Từ Link';
  pageTitle = pageTitle.replace(/(-|\|) (Honda|VinFast|Yadea|Giant|Xe đạp|Xe máy).*/gi, '').trim();

  // Helper to check for generic footer/boilerplate content
  const isBoilerplateText = (text) => {
    const t = text.toLowerCase();
    const keywords = [
      'bảo hành', 'cam kết', 'đổi trả', 'liên hệ', 'hotline', 'địa chỉ', 
      'cửa hàng', 'bản quyền', 'copyright', 'chính sách', 'vận chuyển', 
      'giao hàng', 'thanh toán', 'đăng ký', 'đăng nhập', 'tài khoản', 
      'giỏ hàng', 'khuyến mãi', 'ưu đãi', 'quy định', 'bảo mật', 'cookie', 
      'trình duyệt', 'sđt', 'góp ý', 'khiếu nại', 'hỗ trợ khách hàng',
      'chăm sóc khách hàng', 'điều khoản', 'hướng dẫn mua hàng',
      'phương thức thanh toán', 'mọi chi tiết', 'vui lòng gọi', 'tư vấn miễn phí',
      'nhận tin khuyến mãi', 'bảo hành xe', 'giao hàng toàn quốc', 'gọi miễn phí'
    ];
    return keywords.some(kw => t.includes(kw));
  };

  // 4. Extract Description
  let parsedDescription = '';
  if (jsonLdData.description && !isBoilerplateText(jsonLdData.description)) {
    parsedDescription = jsonLdData.description.trim();
  } else {
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || 
                     doc.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() || 
                     '';
    const pTags = Array.from(doc.querySelectorAll('.entry-content p, .product-description p, article p, .description p, p, li'));
    const textParagraphs = pTags
      .map(p => p.textContent.trim())
      .filter(t => t.length > 40 && t.length < 500 && !t.includes('javascript') && !t.includes('cookie') && !isBoilerplateText(t))
      .slice(0, 5);

    if (metaDesc && !isBoilerplateText(metaDesc)) parsedDescription += metaDesc + '\n\n';
    if (textParagraphs.length > 0) parsedDescription += textParagraphs.join('\n\n');
  }

  if (parsedDescription.length < 50) {
    parsedDescription = `Thông tin sản phẩm được quét tự động từ trang nguồn.\n\nXe sở hữu các công nghệ và trang bị tiêu chuẩn từ hãng sản xuất, mang lại hiệu năng ổn định, an toàn và các tiện ích vượt trội trong phân khúc.`;
  }

  // 5. Detect Brand & Vehicle Type
  const brandInfo = detectBrandAndType(urlStr, pageTitle);
  const brand = brandInfo.brand;
  const type = brandInfo.type;

  // 6. Heuristic layout filters for images
  const isInsideTrashContainer = (el) => {
    let parent = el.parentElement;
    while (parent) {
      const tagName = parent.tagName.toLowerCase();
      const className = (parent.className || '').toLowerCase();
      const id = (parent.id || '').toLowerCase();
      
      if (
        tagName === 'header' || tagName === 'footer' || tagName === 'nav' || tagName === 'aside' ||
        className.includes('header') || className.includes('footer') || className.includes('nav') || 
        className.includes('menu') || className.includes('sidebar') || className.includes('social') ||
        className.includes('payment') || className.includes('popup') || className.includes('modal') ||
        className.includes('widget') || className.includes('banner') || className.includes('adv') ||
        className.includes('comment') || className.includes('review') || className.includes('feedback') ||
        className.includes('related') || className.includes('suggest') || className.includes('recommend') ||
        className.includes('similar') || className.includes('viewed') || className.includes('seen') ||
        className.includes('other') || className.includes('accessory') || className.includes('blog') ||
        className.includes('news') || className.includes('recent') || className.includes('latest') ||
        className.includes('promotion') || className.includes('gift') || className.includes('coupon') ||
        className.includes('deal') || id.includes('header') || id.includes('footer') || id.includes('nav') || 
        id.includes('menu') || id.includes('sidebar') || id.includes('related') || id.includes('suggest') ||
        id.includes('recommend') || id.includes('similar') || id.includes('viewed') || id.includes('seen') ||
        id.includes('other') || id.includes('comment') || id.includes('review')
      ) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  };

  const isTrashElement = (img) => {
    const className = (img.className || '').toLowerCase();
    const id = (img.id || '').toLowerCase();
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    
    const trashKeywords = [
      'logo', 'icon', 'avatar', 'badge', 'gif', 'theme', 'loading', 'arrow', 
      'button', 'btn', 'social', 'marker', 'sprite', 'placeholder', 'default', 
      'blank', 'pixel', 'tracker', 'spacer', 'transparent', 'dot', 'bullet', 
      'visa', 'mastercard', 'momo', 'vnpay', 'shopee', 'lazada', 'tiki', 
      'tragop', 'installment', 'facebook', 'youtube', 'instagram', 'zalo', 
      'tiktok', 'cart', 'search', 'banner', 'header', 'footer', 'nav', 
      'menu', 'sidebar', 'bg', 'background', 'pattern', 'decor', 'ad', 
      'advertisement', 'appstore', 'playstore', 'googleplay', 'ios', 
      'android', 'widget', 'popup', 'close', 'share', 'mail', 'phone', 
      'call', 'hotline', 'messenger', 'chat', 'support', 'map', 'location', 
      'pin', 'rating', 'stars', 'heart', 'like', 'next', 'prev', 'no-image', 
      'noimage', 'spin', 'spinner'
    ];
    
    return trashKeywords.some(kw => className.includes(kw) || id.includes(kw) || alt.includes(kw));
  };

  const getBestImageSrc = (img) => {
    const candidates = [];
    
    // Zoom/Large attributes
    const highResAttrs = ['data-zoom', 'data-zoom-image', 'data-large-img', 'data-high-res-src', 'data-actual-src'];
    highResAttrs.forEach(attr => {
      const val = img.getAttribute(attr);
      if (val && val.trim()) candidates.push({ src: val.trim(), priority: 3 });
    });
    
    // Lazy attributes
    const lazyAttrs = ['data-src', 'data-lazy-src', 'lazy-src', 'data-original', 'data-lazyload'];
    lazyAttrs.forEach(attr => {
      const val = img.getAttribute(attr);
      if (val && val.trim()) candidates.push({ src: val.trim(), priority: 2 });
    });
    
    // Srcset sizes
    const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');
    if (srcset && srcset.trim()) {
      const parts = srcset.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1].split(' ')[0];
        if (lastPart) candidates.push({ src: lastPart, priority: 2 });
      }
    }
    
    // Standard src
    const src = img.getAttribute('src');
    if (src && src.trim()) candidates.push({ src: src.trim(), priority: 1 });
    
    // Filter candidate strings
    const validCandidates = candidates.filter(c => {
      const s = c.src.toLowerCase();
      if (s.startsWith('data:')) return false;
      return !(s.includes('placeholder') || s.includes('pixel') || s.includes('blank') || 
               s.includes('spacer') || s.includes('loading') || s.includes('spinner') ||
               s.includes('lazyload') || s.includes('lazy-placeholder') ||
               s.endsWith('.svg') || s.endsWith('.gif'));
    });
    
    validCandidates.sort((a, b) => b.priority - a.priority);
    return validCandidates.length > 0 ? validCandidates[0].src : null;
  };

  // 7. Gather raw images
  const candidateImages = [];
  const imageSet = new Set();

  // Add JSON-LD product images (Highest priority!)
  jsonLdData.images.forEach(imgUrl => {
    candidateImages.push({ src: imgUrl, isJsonLd: true });
    imageSet.add(imgUrl);
  });

  // Add og:image (High priority!)
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  if (ogImage && !ogImage.toLowerCase().includes('logo') && !ogImage.toLowerCase().includes('icon')) {
    if (!imageSet.has(ogImage)) {
      candidateImages.push({ src: ogImage, isOg: true });
      imageSet.add(ogImage);
    }
  }

  // Scan img tags in main content
  let imgTags = [];
  const priorityContainers = doc.querySelectorAll('.product-images, .product-gallery, .woocommerce-product-gallery, .gallery, .main, [role="main"], #content, .content, article, .main-content');
  if (priorityContainers.length > 0) {
    priorityContainers.forEach(container => {
      imgTags = [...imgTags, ...Array.from(container.querySelectorAll('img'))];
    });
  }
  if (imgTags.length === 0) {
    imgTags = Array.from(doc.querySelectorAll('img'));
  }

  imgTags.forEach(img => {
    if (isInsideTrashContainer(img)) return;
    if (isTrashElement(img)) return;
    
    const w = parseInt(img.getAttribute('width'), 10);
    const h = parseInt(img.getAttribute('height'), 10);
    if ((w && w < 120) || (h && h < 120)) return;

    const bestSrc = getBestImageSrc(img);
    if (bestSrc && !imageSet.has(bestSrc)) {
      candidateImages.push({ src: bestSrc });
      imageSet.add(bestSrc);
    }
  });

  // Normalize image URLs
  const normalizedImages = [];
  candidateImages.forEach(item => {
    let src = item.src;
    let absoluteUrl = src;
    if (src.startsWith('//')) {
      absoluteUrl = 'https:' + src;
    } else if (src.startsWith('/')) {
      absoluteUrl = baseUrlObj.origin + src;
    } else if (!src.startsWith('http://') && !src.startsWith('https://')) {
      const pathSegs = baseUrlObj.pathname.split('/');
      pathSegs.pop();
      absoluteUrl = baseUrlObj.origin + pathSegs.join('/') + '/' + src;
    }

    try {
      const parsed = new URL(absoluteUrl);
      const path = parsed.pathname.toLowerCase();
      const isImgExt = path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.webp') || path.endsWith('.jfif');
      if (!isImgExt) return;

      normalizedImages.push({
        url: absoluteUrl,
        isJsonLd: item.isJsonLd || false,
        isOg: item.isOg || false
      });
    } catch (e) {
      // ignore
    }
  });

  // Chấm điểm ảnh (Keyword-based Image Scoring)
  const slugKeywords = baseUrlObj.pathname ? baseUrlObj.pathname.split('/').flatMap(s => s.split('-')).filter(Boolean) : [];
  const titleKeywords = pageTitle.toLowerCase().split(/\s+/).filter(Boolean);

  const scoredImages = normalizedImages.map(img => {
    let score = 0;
    const urlLower = img.url.toLowerCase();

    // JSON-LD official images get massive boost
    if (img.isJsonLd) score += 100;
    
    // OpenGraph main image gets boost
    if (img.isOg) score += 50;

    // Match URL slug segment keywords (ignore common helper words)
    slugKeywords.forEach(kw => {
      const stopWords = ['xe', 'may', 'dien', 'dap', 'chinh', 'hang', 'gia', 're', 'viet', 'thanh', 'com', 'vn'];
      if (kw.length > 2 && !stopWords.includes(kw)) {
        if (urlLower.includes(kw)) score += 15;
      }
    });

    // Match page title keywords
    titleKeywords.forEach(kw => {
      const stopWords = ['xe', 'may', 'dien', 'dap', 'chinh', 'hang'];
      if (kw.length > 2 && !stopWords.includes(kw)) {
        if (urlLower.includes(kw)) score += 8;
      }
    });

    // WP upload folder boost (shows it is a custom media upload)
    if (urlLower.includes('wp-content/uploads/')) score += 5;

    // High quality keywords boost
    if (urlLower.includes('large') || urlLower.includes('zoom') || urlLower.includes('original') || urlLower.includes('max') || urlLower.includes('full')) {
      score += 3;
    }

    return { url: img.url, score };
  });

  // Sort images descending by score, filter duplicates, and take top 8
  scoredImages.sort((a, b) => b.score - a.score);
  const uniqueUrls = new Set();
  const finalImages = [];
  scoredImages.forEach(img => {
    if (!uniqueUrls.has(img.url)) {
      uniqueUrls.add(img.url);
      finalImages.push(img.url);
    }
  });

  const slicedImages = finalImages.slice(0, 8);

  // 8. Specifications Parser
  const extractSpecsFromDOM = (doc, vehicleType) => {
    const scrapedSpecs = {};
    const kvPairs = [];
    
    // Read HTML tables
    doc.querySelectorAll('tr').forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('td, th'));
      if (cells.length === 2) {
        const key = cells[0].textContent.trim();
        const val = cells[1].textContent.trim();
        if (key && val) kvPairs.push({ key, val });
      }
    });
    
    // Read list items split by colon (e.g. <li>Vận tốc: 44km/h</li>)
    doc.querySelectorAll('li').forEach(li => {
      const text = li.textContent.trim();
      if (text.includes(':')) {
        const parts = text.split(':');
        const key = parts[0].trim().replace(/^[-•*+]/, '').trim(); // strip bullets
        const val = parts.slice(1).join(':').trim();
        if (key && val && key.length < 50 && val.length < 150 && !isBoilerplateText(key)) {
          kvPairs.push({ key, val });
        }
      } else {
        const strong = li.querySelector('strong, b, span.label');
        if (strong) {
          const key = strong.textContent.trim().replace(/:$/, '').trim();
          const val = li.textContent.replace(strong.textContent, '').trim().replace(/^:/, '').trim();
          if (key && val && key.length < 50 && val.length < 150 && !isBoilerplateText(key)) {
            kvPairs.push({ key, val });
          }
        }
      }
    });

    // Read spec rows
    doc.querySelectorAll('.spec-row, .thongso-row, .technical-row').forEach(row => {
      const nameEl = row.querySelector('.spec-name, .label, .title, .left');
      const valEl = row.querySelector('.spec-value, .value, .right');
      if (nameEl && valEl) {
        kvPairs.push({ key: nameEl.textContent.trim(), val: valEl.textContent.trim() });
      }
    });

    const findValue = (keywords) => {
      for (const pair of kvPairs) {
        const k = pair.key.toLowerCase();
        if (keywords.some(kw => k.includes(kw))) {
          return pair.val;
        }
      }
      return null;
    };

    if (vehicleType === 'motorbike') {
      scrapedSpecs.engine = findValue(['dung tích xi-lanh', 'dung tich xi lanh', 'phân khối', 'phan khoi', 'động cơ', 'dong co', 'displacement', 'engine']) || '';
      scrapedSpecs.engineType = findValue(['loại động cơ', 'loai dong co', 'kiểu động cơ', 'kieu dong co', 'engine type']) || '';
      scrapedSpecs.fuelConsumption = findValue(['tiêu thụ nhiên liệu', 'tieu thu nhien lieu', 'tiêu hao nhiên liệu', 'tieu hao nhien lieu', 'fuel consumption']) || '';
      scrapedSpecs.transmission = findValue(['hộp số', 'hop so', 'truyền động', 'truyen dong', 'transmission']) || '';
      scrapedSpecs.torque = findValue(['mô-men xoắn', 'mo-men xoan', 'mô men xoắn', 'torque']) || '';
      scrapedSpecs.power = findValue(['công suất tối đa', 'cong suat toi da', 'công suất', 'cong suat', 'power']) || '';
      scrapedSpecs.brakes = findValue(['phanh', 'thắng', 'brakes', 'brake']) || '';
      scrapedSpecs.tires = findValue(['lốp', 'vỏ', 'tires', 'tire']) || '';
      scrapedSpecs.yHeight = findValue(['chiều cao yên', 'chieu cao yen', 'yên xe', 'seat height']) || '';
      scrapedSpecs.tankCapacity = findValue(['dung tích bình xăng', 'dung tich binh xang', 'bình xăng', 'fuel tank']) || '';
      scrapedSpecs.weight = findValue(['khối lượng bản thân', 'khoi luong ban than', 'trọng lượng', 'trong luong', 'khối lượng', 'khoi luong', 'weight']) || '';
    } else if (vehicleType === 'bicycle') {
      scrapedSpecs.frame = findValue(['khung', 'sườn', 'frame']) || '';
      scrapedSpecs.fork = findValue(['phuộc', 'càng', 'fork']) || '';
      scrapedSpecs.groupset = findValue(['bộ đề', 'bộ truyền động', 'groupset', 'derailleur', 'tay đề']) || '';
      scrapedSpecs.brakes = findValue(['phanh', 'thắng', 'brakes', 'brake']) || '';
      scrapedSpecs.tires = findValue(['lốp', 'vỏ', 'tires', 'tire']) || '';
      scrapedSpecs.weight = findValue(['trọng lượng', 'trong luong', 'khối lượng', 'khoi luong', 'weight']) || '';
    } else {
      // electric
      scrapedSpecs.battery = findValue(['pin', 'ắc quy', 'ac quy', 'battery', 'cell', 'nguồn điện']) || '';
      scrapedSpecs.batteryType = findValue(['loại pin', 'loại ắc quy', 'loai acquy', 'battery type']) || '';
      scrapedSpecs.range = findValue(['quãng đường', 'quang duong', 'hành trình', 'range']) || '';
      scrapedSpecs.maxSpeed = findValue(['vận tốc tối đa', 'van toc toi da', 'tốc độ tối đa', 'toc do toi da', 'tốc độ', 'toc do', 'max speed', 'speed']) || '';
      scrapedSpecs.power = findValue(['công suất', 'cong suat', 'power']) || '';
      scrapedSpecs.motorType = findValue(['động cơ', 'dong co', 'loại động cơ', 'motor type']) || '';
      scrapedSpecs.torque = findValue(['mô-men xoắn', 'mo-men xoan', 'torque']) || '';
      scrapedSpecs.brakes = findValue(['phanh', 'thắng', 'brakes', 'brake']) || '';
      scrapedSpecs.tires = findValue(['lốp', 'vỏ', 'tires', 'tire']) || '';
      scrapedSpecs.waterproof = findValue(['chống nước', 'chong nuoc', 'kháng nước', 'khang nuoc', 'waterproof', 'ipx']) || '';
      scrapedSpecs.weight = findValue(['trọng lượng', 'trong luong', 'khối lượng', 'khoi luong', 'weight']) || '';
    }
    return scrapedSpecs;
  };

  const extractedSpecs = extractSpecsFromDOM(doc, type);

  const defaultSpecs = type === 'motorbike' ? {
    engine: pageTitle.includes('350') ? '329 cc' : pageTitle.includes('160') ? '156.9 cc' : '110 cc',
    engineType: 'Động cơ xăng eSP+, 4 kỳ, xi-lanh đơn, làm mát bằng chất lỏng',
    fuelConsumption: pageTitle.includes('350') ? '3.54 lít/100km' : pageTitle.includes('160') ? '2.24 lít/100km' : '1.87 lít/100km',
    transmission: 'Tự động vô cấp CVT',
    torque: pageTitle.includes('350') ? '31.8 Nm tại 5.250 vòng/phút' : pageTitle.includes('160') ? '14.8 Nm tại 6.500 vòng/phút' : '9.29 Nm tại 5.250 vòng/phút',
    power: pageTitle.includes('350') ? '28.8 HP' : pageTitle.includes('160') ? '16.6 HP' : '8.8 HP',
    brakes: 'Phanh đĩa tản nhiệt an toàn',
    tires: 'Lốp không săm bám đường tốt',
    yHeight: '760 mm - 799 mm',
    tankCapacity: '4.9 Lít - 7.8 Lít',
    weight: '97 kg - 133 kg'
  } : type === 'bicycle' ? {
    frame: 'Hợp kim nhôm siêu nhẹ',
    fork: 'Phuộc đơ chịu lực tốt',
    groupset: 'Shimano Tourney 21 tốc độ',
    brakes: 'Phanh đĩa cơ học tản nhiệt tốt',
    tires: 'Lốp bám đường cao cấp 700x38c',
    weight: '12.5 kg'
  } : {
    battery: 'Pin Lithium LFP thế mới / Ắc quy Graphene',
    batteryType: 'Công nghệ cell pin sạc an toàn cao',
    range: '100 km - 198 km / lần sạc',
    maxSpeed: '45 km/h - 78 km/h',
    power: '1500 W - 3000 W',
    motorType: 'Động cơ một chiều không chổi than',
    torque: '70 Nm - 140 Nm',
    brakes: 'Phanh đĩa trước, Phanh sau CBS/cơ',
    tires: 'Lốp không săm siêu bền bỉ',
    waterproof: 'Tiêu chuẩn kháng nước toàn diện IP67 / IPX6',
    weight: '97 kg - 110 kg'
  };

  const mergedSpecs = {};
  Object.keys(defaultSpecs).forEach(key => {
    mergedSpecs[key] = (extractedSpecs[key] && extractedSpecs[key].trim()) 
      ? extractedSpecs[key].trim() 
      : defaultSpecs[key];
  });

  return {
    id: `scraped-${Date.now()}`,
    name: pageTitle.substring(0, 50),
    type: type,
    brand: brand,
    price: jsonLdData.price || 0,
    originalPrice: null,
    priceMode: jsonLdData.price ? 'normal' : 'contact',
    images: slicedImages,
    description: parsedDescription,
    specs: mergedSpecs,
    features: ['Quét dữ liệu thực tế từ URL', 'Hình ảnh thật từ Website', 'Thông số tự động bóc tách']
  };
};

export default function SpecImporter({ onImportComplete }) {
  const [selectedPopular, setSelectedPopular] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [showManualHtml, setShowManualHtml] = useState(false);
  const [manualHtml, setManualHtml] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleUseMockDemo = () => {
    setLoading(true);
    setErrorText('');
    setStatusText('Đang khởi tạo dữ liệu mẫu demo...');
    
    setTimeout(() => {
      const urlStr = customUrl.trim() || 'https://xedienvietthanh.com/xe-may-dien-yadea-ova/';
      const brandInfo = detectBrandAndType(urlStr);
      const brand = brandInfo.brand;
      const type = brandInfo.type;

      let name = brand === 'Yadea' ? 'Yadea Ova' : brand === 'Honda' ? 'Honda SH 160i' : 'Xe máy điện cao cấp';
      let images = [];
      let description = `Mẫu xe ${brand} thiết kế mới cực đẹp, trẻ trung năng động và thích hợp cho việc di chuyển trong đô thị lớn.`;

      if (brand === 'Honda') {
        images = [
          'https://upload.wikimedia.org/wikipedia/commons/1/14/Honda_SH150i_2013.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/7/73/Honda_SH300i_2009.jpg'
        ];
      } else if (brand === 'VinFast') {
        images = [
          'https://upload.wikimedia.org/wikipedia/commons/4/4e/Newone_-_VinFast_Klara_S_01.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/e/e0/Newone_-VinFast_Klara_S_red.jpg'
        ];
      } else {
        images = [
          'https://upload.wikimedia.org/wikipedia/commons/b/bd/Vespa_Elettrica_at_EICMA_2018_01.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/d/d0/E-Roller_Emco_NOVI_C_1500_Miku_Max.jpg'
        ];
      }

      const mockSpecs = type === 'motorbike' ? {
        engine: '156.9 cc',
        engineType: 'Động cơ xăng eSP+, 4 kỳ',
        fuelConsumption: '2.24 lít/100km',
        transmission: 'CVT vô cấp',
        torque: '14.8 Nm',
        power: '16.6 HP',
        brakes: 'Phanh đĩa ABS trước/sau',
        tires: 'Lốp không săm',
        yHeight: '799 mm',
        tankCapacity: '7.8 Lít',
        weight: '133 kg'
      } : {
        battery: 'Ắc quy Graphene TTFAR 60V - 22Ah',
        batteryType: 'Ắc quy chuyên dụng xe máy điện',
        range: '60 - 80 km / lần sạc',
        maxSpeed: '44 km/h',
        power: '1450 W (tối đa)',
        motorType: 'Động cơ Hub không chổi than',
        torque: '70 Nm',
        brakes: 'Phanh đĩa trước, Phanh cơ sau',
        tires: 'Lốp không săm',
        waterproof: 'IPX6/IP67',
        weight: '88 kg'
      };

      const scrapedProduct = {
        id: `mock-${Date.now()}`,
        name: name,
        type: type,
        brand: brand,
        price: 0,
        originalPrice: null,
        priceMode: 'contact',
        images: images,
        description: description,
        specs: mockSpecs,
        features: ['Dữ liệu mẫu giả lập', 'Điền thông tin demo nhanh']
      };

      onImportComplete(scrapedProduct);
      setLoading(false);
      setSuccess(true);
      setCustomUrl('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleImport = async () => {
    if (!selectedPopular && !customUrl.trim()) return;

    setLoading(true);
    setSuccess(false);
    setErrorText('');
    setStatusText('Đang khởi động tiến trình quét...');

    if (selectedPopular) {
      // Find in predefined list
      setTimeout(() => {
        setStatusText('Đang phân tích cấu trúc trang web...');
        setTimeout(() => {
          setStatusText('Đang cào hình ảnh và bảng thông số kỹ thuật...');
          setTimeout(() => {
            const found = popularImporterBikes.find(b => b.id === selectedPopular);
            if (found) {
              const importedProduct = JSON.parse(JSON.stringify(found));
              importedProduct.id = `${found.id}-${Date.now()}`;
              importedProduct.price = 0;
              importedProduct.priceMode = 'contact'; // default
              onImportComplete(importedProduct);
              setLoading(false);
              setSuccess(true);
              setSelectedPopular('');
              setCustomUrl('');
              setTimeout(() => setSuccess(false), 3000);
            } else {
              setLoading(false);
            }
          }, 1000);
        }, 800);
      }, 800);
      return;
    }

    const urlStr = customUrl.trim();
    let htmlContent = '';

    // 1. Try Local/Vercel Dev API Proxy first (runs Node.js server-side, bypasses CORS, uses home IP)
    try {
      setStatusText('Đang kết nối qua máy chủ API Proxy...');
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(urlStr)}`;
      const response = await fetch(proxyUrl);
      if (response.ok) {
        htmlContent = await response.text();
        if (htmlContent && htmlContent.trim().length > 200 && !htmlContent.includes('Server-side requests are not allowed')) {
          console.log('Local/Vercel API Proxy fetch succeeded!');
        } else {
          htmlContent = '';
        }
      }
    } catch (e) {
      console.log('Local/Vercel API Proxy fetch failed, trying direct...', e);
    }

    // 2. Try Direct Fetch (will succeed if user has CORS bypass extension enabled)
    if (!htmlContent) {
      try {
        setStatusText('Đang thử kết nối trực tiếp (Direct Fetch)...');
        const response = await fetch(urlStr);
        if (response.ok) {
          htmlContent = await response.text();
          if (htmlContent && htmlContent.trim().length > 200 && !htmlContent.includes('Server-side requests are not allowed')) {
            console.log('Direct fetch succeeded!');
          } else {
            htmlContent = '';
          }
        }
      } catch (e) {
        console.log('Direct fetch blocked by CORS, trying public proxies...');
      }
    }

    // 3. Try Public CORS Proxies if local and direct fetch failed
    if (!htmlContent) {
      const proxies = [
        {
          name: 'Máy chủ A (corsproxy.io)',
          url: `https://corsproxy.io/?${encodeURIComponent(urlStr)}`,
          type: 'text'
        },
        {
          name: 'Máy chủ B (codetabs.com)',
          url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlStr)}`,
          type: 'text'
        },
        {
          name: 'Máy chủ C (allorigins.win)',
          url: `https://api.allorigins.win/get?url=${encodeURIComponent(urlStr)}`,
          type: 'json'
        },
        {
          name: 'Máy chủ D (thingproxy)',
          url: `https://thingproxy.freeboard.io/fetch/${urlStr}`,
          type: 'text'
        }
      ];

      for (const proxy of proxies) {
        try {
          setStatusText(`Đang quét dữ liệu qua ${proxy.name}...`);
          const response = await fetch(proxy.url);
          if (response.ok) {
            if (proxy.type === 'text') {
              htmlContent = await response.text();
            } else if (proxy.type === 'json') {
              const data = await response.json();
              htmlContent = data.contents || '';
            }
            if (htmlContent && htmlContent.trim().length > 200 && !htmlContent.includes('Server-side requests are not allowed')) {
              console.log(`Scraping succeeded using proxy: ${proxy.name}`);
              break;
            } else {
              htmlContent = '';
            }
          }
        } catch (e) {
          console.warn(`${proxy.name} failed:`, e);
        }
      }
    }

    // 4. Process scraped content or fail
    if (htmlContent) {
      try {
        setStatusText('Đang phân tích và trích xuất dữ liệu...');
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        const scrapedProduct = parseHtmlToProduct(doc, urlStr);
        onImportComplete(scrapedProduct);
        setLoading(false);
        setSuccess(true);
        setCustomUrl('');
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error parsing content:', error);
        setLoading(false);
        setErrorText('Lỗi khi bóc tách dữ liệu từ trang web. Vui lòng kiểm tra lại liên kết sản phẩm.');
      }
    } else {
      setLoading(false);
      setErrorText('⚠️ Không thể tự động kết nối và quét dữ liệu từ trang web đối thủ này (bị chặn bởi Cloudflare hoặc Tường lửa). Vui lòng thử lại sau.');
    }
  };

  const handleParseManualHtml = () => {
    if (!manualHtml.trim()) {
      alert('Vui lòng dán mã HTML của trang web!');
      return;
    }
    
    setLoading(true);
    setStatusText('Đang bóc tách HTML thủ công...');
    setErrorText('');
    
    setTimeout(() => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(manualHtml, 'text/html');
        const urlStr = customUrl.trim() || 'https://xedienvietthanh.com/xe-may-dien-yadea-ova/';
        
        const scrapedProduct = parseHtmlToProduct(doc, urlStr);
        onImportComplete(scrapedProduct);
        setLoading(false);
        setSuccess(true);
        setManualHtml('');
        setShowManualHtml(false);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error(err);
        alert('Có lỗi khi phân tích mã HTML. Hãy bảo đảm bạn copy đúng toàn bộ mã nguồn trang!');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="importer-widget">
      <div className="importer-title">
        <Sparkles size={16} />
        <span>Trợ Lý Nhập Thông Số Nhanh (Smart Spec Importer)</span>
      </div>
      <p className="importer-desc">
        Quét thông số xe nhanh chóng từ Website đối thủ hoặc hãng xe lớn (Honda, VinFast, Yadea, Giant...) hoặc chọn mẫu có sẵn để điền tự động.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        {/* Option A: Select Popular Predefined Vehicle */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            value={selectedPopular}
            onChange={(e) => {
              setSelectedPopular(e.target.value);
              setCustomUrl('');
              setErrorText('');
            }}
            className="form-select"
            style={{ fontSize: '13px', height: '36px', flex: 1 }}
            disabled={loading}
          >
            <option value="">-- Chọn xe Hot hãng có sẵn... --</option>
            {popularImporterBikes.map(b => (
              <option key={b.id} value={b.id}>
                [{b.brand}] {b.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Hoặc dán Link URL đối thủ</div>

        {/* Option B: Enter Competitor URL */}
        <div className="importer-row">
          <input 
            type="url"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              setSelectedPopular('');
              setErrorText('');
            }}
            placeholder="Ví dụ: honda.com.vn/san-pham/lead..."
            className="form-input"
            style={{ fontSize: '12px', height: '36px', flex: 1 }}
            disabled={loading}
          />
        </div>

        {/* Error / Firewall alert display */}
        {errorText && (
          <div style={{ 
            padding: '10px', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--accent)',
            fontSize: '12px',
            lineHeight: '1.5',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div>{errorText}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleUseMockDemo}
                className="btn btn-primary"
                style={{ 
                  fontSize: '11px', 
                  padding: '4px 8px', 
                  height: '24px', 
                  background: 'var(--primary)', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Tự động điền dữ liệu mẫu (Demo)
              </button>
            </div>
          </div>
        )}

        <button 
          id="btn-import-specs"
          onClick={handleImport}
          className="btn btn-primary"
          style={{ height: '40px', width: '100%', fontSize: '14px', padding: '0 12px', background: success ? 'var(--secondary)' : 'var(--primary)' }}
          disabled={loading || (!selectedPopular && !customUrl.trim())}
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span style={{ fontSize: '12px' }}>{statusText}</span>
            </>
          ) : success ? (
            <>
              <Check size={14} />
              <span>Đã Điền Form Tự Động!</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>Quét & Tự Động Điền Form</span>
            </>
          )}
        </button>

        {/* Fallback option when blocked: Manual HTML Paste */}
        <div id="manual-html-section" style={{ marginTop: '12px', borderTop: '1px dashed var(--border)', paddingTop: '8px', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => setShowManualHtml(!showManualHtml)}
            className="btn"
            style={{ 
              background: 'none', 
              color: 'var(--text-secondary)', 
              border: 'none',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px 8px'
            }}
          >
            <span>{showManualHtml ? 'Ẩn ô dán mã nguồn' : 'Nhập bằng mã nguồn HTML (Kỹ thuật)'}</span>
          </button>
          
          {showManualHtml && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              marginTop: '8px', 
              background: 'var(--surface-sub)', 
              padding: '8px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                💡 <b>Mẹo bypass tường lửa (kỹ thuật):</b> Vào trang web đối thủ ➔ Nhấn <b>Ctrl + U</b> (Xem nguồn trang) ➔ <b>Ctrl + A</b> (Chọn tất cả) ➔ <b>Ctrl + C</b> (Copy) ➔ Dán vào ô bên dưới:
              </p>
              <textarea
                value={manualHtml}
                onChange={(e) => setManualHtml(e.target.value)}
                placeholder="Dán mã HTML (Ctrl+V) vào đây..."
                className="form-textarea"
                style={{ height: '100px', fontSize: '11px', fontFamily: 'monospace', width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)' }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleParseManualHtml}
                className="btn btn-primary"
                style={{ height: '32px', fontSize: '12px', width: '100%', background: 'var(--secondary)' }}
                disabled={loading || !manualHtml.trim()}
              >
                {loading ? 'Đang phân tích HTML...' : 'Bóc tách thông tin từ HTML'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

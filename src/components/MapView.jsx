import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';

export default function MapView({ shopCoordinates, shopAddress, shopName }) {
  const [userCoords, setUserCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [durationEstimate, setDurationEstimate] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mockLocation, setMockLocation] = useState('');

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Estimate travel time by motorbike (average speed ~30 km/h in urban areas)
  const estimateTravelTime = (distKm) => {
    const speedKmh = 30;
    const timeHours = distKm / speedKmh;
    const timeMinutes = Math.round(timeHours * 60);
    
    if (timeMinutes < 1) return 'Chưa đầy 1 phút';
    if (timeMinutes < 60) return `${timeMinutes} phút`;
    
    const hours = Math.floor(timeMinutes / 60);
    const mins = timeMinutes % 60;
    return `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`;
  };

  const requestGpsLocation = () => {
    setGpsLoading(true);
    setGpsError(null);
    setMockLocation('');

    if (!navigator.geolocation) {
      setGpsError('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        
        const d = calculateDistance(latitude, longitude, shopCoordinates.lat, shopCoordinates.lng);
        setDistance(d);
        setDurationEstimate(estimateTravelTime(d));
        setGpsLoading(false);
      },
      (error) => {
        console.warn('GPS Error:', error);
        setGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Quyền truy cập vị trí bị từ chối. Bạn có thể sử dụng Vị trí Giả lập bên dưới để trải nghiệm.');
        } else {
          setGpsError('Không thể xác định vị trí GPS. Vui lòng thử lại hoặc chọn vị trí giả lập.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleMockLocationChange = (e) => {
    const val = e.target.value;
    setMockLocation(val);
    setGpsError(null);

    if (!val) {
      setUserCoords(null);
      setDistance(null);
      setDurationEstimate(null);
      return;
    }

    // Parse coordinates from mock location values
    let mockLat, mockLng;
    switch (val) {
      case 'hanoi-center': // Ho Guom
        mockLat = 21.0285; mockLng = 105.8521; break;
      case 'cau-giay':
        mockLat = 21.0333; mockLng = 105.7958; break;
      case 'my-dinh':
        mockLat = 21.0167; mockLng = 105.7783; break;
      case 'hadong':
        mockLat = 20.9723; mockLng = 105.7744; break;
      default:
        return;
    }

    setUserCoords({ lat: mockLat, lng: mockLng });
    const d = calculateDistance(mockLat, mockLng, shopCoordinates.lat, shopCoordinates.lng);
    setDistance(d);
    setDurationEstimate(estimateTravelTime(d));
  };

  useEffect(() => {
    // Attempt auto-location request on load, but degrade gracefully
    requestGpsLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopCoordinates]);

  // Universal deep link to open Google Maps Directions on mobile/desktop
  const getDirectionsLink = () => {
    if (userCoords) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${shopCoordinates.lat},${shopCoordinates.lng}&travelmode=two-wheeler`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${shopCoordinates.lat},${shopCoordinates.lng}&travelmode=two-wheeler`;
  };

  // Embeddable Google Maps iframe URL
  const getEmbedMapUrl = () => {
    // Generate iframe source using coordinates
    return `https://maps.google.com/maps?q=${shopCoordinates.lat},${shopCoordinates.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="map-container">
      <div className="location-status-bar">
        <div className="shop-info-mini">
          <div className="shop-avatar">
            <MapPin size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{shopName}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{shopAddress}</p>
          </div>
        </div>

        <div className="gps-box">
          <div className="gps-title">
            <span>Khoảng cách đến cửa hàng</span>
            <button 
              onClick={requestGpsLocation} 
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              disabled={gpsLoading}
            >
              <Compass size={14} className={gpsLoading ? 'animate-spin' : ''} />
              {gpsLoading ? 'Đang định vị...' : 'Định vị lại'}
            </button>
          </div>

          {distance !== null ? (
            <div className="distance-details">
              <div className="distance-item">
                <div className="distance-num">{distance} km</div>
                <div className="distance-label">Khoảng cách địa lý</div>
              </div>
              <div className="distance-item">
                <div className="distance-num">~{durationEstimate}</div>
                <div className="distance-label">Thời gian đi xe máy</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '4px 0' }}>
              {gpsLoading ? 'Đang xác định khoảng cách của bạn...' : 'Đang chờ cấp quyền định vị...'}
            </div>
          )}

          {gpsError && (
            <div style={{ fontSize: '0.75rem', color: 'var(--error)', display: 'flex', gap: '6px', alignItems: 'flex-start', background: 'rgba(217, 48, 37, 0.05)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Simulator drop-down for demo testing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '4px' }}>
            <label htmlFor="mock-location-select" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Giả lập GPS:</label>
            <select 
              id="mock-location-select"
              value={mockLocation} 
              onChange={handleMockLocationChange}
              className="form-select"
              style={{ height: '28px', fontSize: '0.75rem', padding: '0 4px', borderRadius: '4px', flex: 1 }}
            >
              <option value="">Chọn vị trí giả lập...</option>
              <option value="hanoi-center">Hồ Gươm, Hoàn Kiếm (~1.5 km)</option>
              <option value="cau-giay">Cầu Giấy, Hà Nội (~5.2 km)</option>
              <option value="my-dinh">Bến xe Mỹ Đình (~8.0 km)</option>
              <option value="hadong">Quận Hà Đông (~12.5 km)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="map-iframe-wrapper">
        <iframe 
          title="Google Map Location"
          className="map-iframe"
          src={getEmbedMapUrl()}
          allowFullScreen="" 
          loading="lazy"
        />
        
        <div className="map-overlay-button">
          <a 
            href={getDirectionsLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <Navigation size={18} />
            <span>Mở chỉ đường trên Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}

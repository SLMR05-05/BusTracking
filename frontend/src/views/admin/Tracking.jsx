import { useState, useEffect, useRef } from 'react';
import { Bus, MapPin, Clock, CheckCircle, Circle, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Tracking() {
  // ============================================
  // STATE - Dữ liệu mô phỏng chuyến đi
  // ============================================
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [busPosition, setBusPosition] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const busMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const stationMarkersRef = useRef([]);

  // Dữ liệu chuyến đi mẫu với tọa độ thực tế ở TP.HCM
  const journey = {
    busId: 'XB001',
    busNumber: '29A-12345',
    routeName: 'Tuyến 1 - Quận 1 đến Quận 5',
    driverName: 'Nguyễn Văn A',
    startTime: '07:00',
    status: 'Đang di chuyển',
    stops: [
      { 
        id: 1, 
        name: 'Trạm 1 - Trường ABC', 
        address: '123 Nguyễn Văn Cừ, Q.5',
        time: '07:00',
        students: 5,
        lat: 10.7626,
        lng: 106.6818,
        status: 'completed'
      },
      { 
        id: 2, 
        name: 'Trạm 2 - Chợ Bến Thành', 
        address: '45 Lê Lợi, Q.1',
        time: '07:15',
        students: 3,
        lat: 10.7720,
        lng: 106.6980,
        status: 'completed'
      },
      { 
        id: 3, 
        name: 'Trạm 3 - Công viên 23/9', 
        address: '89 Võ Thị Sáu, Q.3',
        time: '07:30',
        students: 4,
        lat: 10.7820,
        lng: 106.6950,
        status: 'current'
      },
      { 
        id: 4, 
        name: 'Trạm 4 - Bệnh viện Nhi Đồng', 
        address: '67 Phan Đăng Lưu, Q.Phú Nhuận',
        time: '07:45',
        students: 6,
        lat: 10.7990,
        lng: 106.6780,
        status: 'pending'
      },
      { 
        id: 5, 
        name: 'Trạm 5 - Trường XYZ (Điểm cuối)', 
        address: '200 Hoàng Hoa Thám, Q.Tân Bình',
        time: '08:00',
        students: 0,
        lat: 10.7870,
        lng: 106.6550,
        status: 'pending'
      }
    ]
  };

  // ============================================
  // LẤY ĐƯỜNG ĐI TỪ OSRM API
  // ============================================
  useEffect(() => {
    const fetchRoute = async () => {
      setIsLoadingRoute(true);
      try {
        // Tạo chuỗi tọa độ cho OSRM
        const coordinates = journey.stops
          .map(stop => `${stop.lng},${stop.lat}`)
          .join(';');
        
        // Gọi OSRM API để lấy đường đi
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
        );
        
        if (!response.ok) throw new Error('Failed to fetch route');
        
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          // Lấy tọa độ đường đi từ OSRM (đã là [lng, lat])
          const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteCoordinates(coords);
        } else {
          // Fallback: sử dụng đường thẳng nếu OSRM không trả về kết quả
          const fallbackCoords = journey.stops.map(stop => [stop.lat, stop.lng]);
          setRouteCoordinates(fallbackCoords);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback: sử dụng đường thẳng
        const fallbackCoords = journey.stops.map(stop => [stop.lat, stop.lng]);
        setRouteCoordinates(fallbackCoords);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    fetchRoute();
  }, []);

  // ============================================
  // KHỞI TẠO BẢN ĐỒ
  // ============================================
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || isLoadingRoute || routeCoordinates.length === 0) return;

    // Tạo bản đồ
    const map = L.map(mapRef.current).setView([10.7769, 106.6820], 13);
    
    // Thêm tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Vẽ các trạm
    journey.stops.forEach((stop, index) => {
      const isFirst = index === 0;
      const isLast = index === journey.stops.length - 1;
      
      const icon = L.divIcon({
        className: 'custom-station-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: ${isFirst ? '#10b981' : isLast ? '#ef4444' : '#3b82f6'};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([stop.lat, stop.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${stop.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${stop.address}</p>
            <p style="font-size: 12px; color: #666;">⏰ ${stop.time}</p>
            ${stop.students > 0 ? `<p style="font-size: 12px; color: #666;">👥 ${stop.students} học sinh</p>` : ''}
          </div>
        `);
      
      stationMarkersRef.current.push(marker);
    });

    // Vẽ đường đi theo OSRM
    const polyline = L.polyline(routeCoordinates, {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.8,
    }).addTo(map);
    routeLineRef.current = polyline;

    // Fit bounds để hiển thị toàn bộ tuyến đường
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    // Tạo icon xe bus
    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div style="
          width: 50px;
          height: 50px;
          background: #fbbf24;
          border: 4px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          animation: pulse 2s infinite;
        ">
          <span style="font-size: 24px;">🚌</span>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });

    // Đặt xe bus ở trạm đầu tiên
    const initialPosition = [journey.stops[0].lat, journey.stops[0].lng];
    const busMarker = L.marker(initialPosition, { icon: busIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center;">
          <h3 style="font-weight: bold;">🚌 Xe ${journey.busNumber}</h3>
          <p style="font-size: 12px; color: #666;">Tài xế: ${journey.driverName}</p>
        </div>
      `);
    
    busMarkerRef.current = busMarker;
    setBusPosition(initialPosition);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [routeCoordinates, isLoadingRoute]);

  // ============================================
  // MÔ PHỎNG - Di chuyển xe bus theo đường OSRM
  // ============================================
  useEffect(() => {
    if (!isMoving || !busMarkerRef.current || routeCoordinates.length === 0) return;

    const currentStop = journey.stops[currentStopIndex];
    const nextStop = journey.stops[currentStopIndex + 1];
    
    if (!nextStop) {
      setIsMoving(false);
      return;
    }

    // Tìm các điểm trên đường đi giữa 2 trạm
    const currentStopIndex_route = routeCoordinates.findIndex(
      coord => Math.abs(coord[0] - currentStop.lat) < 0.001 && Math.abs(coord[1] - currentStop.lng) < 0.001
    );
    const nextStopIndex_route = routeCoordinates.findIndex(
      coord => Math.abs(coord[0] - nextStop.lat) < 0.001 && Math.abs(coord[1] - nextStop.lng) < 0.001
    );

    let pathSegment = [];
    if (currentStopIndex_route !== -1 && nextStopIndex_route !== -1) {
      // Lấy đoạn đường giữa 2 trạm
      pathSegment = routeCoordinates.slice(currentStopIndex_route, nextStopIndex_route + 1);
    } else {
      // Fallback: đường thẳng
      pathSegment = [[currentStop.lat, currentStop.lng], [nextStop.lat, nextStop.lng]];
    }

    // Di chuyển xe bus theo từng điểm trên đường
    let pointIndex = 0;
    const moveInterval = setInterval(() => {
      if (pointIndex >= pathSegment.length) {
        clearInterval(moveInterval);
        // Chuyển sang trạm tiếp theo
        setTimeout(() => {
          setCurrentStopIndex(prev => {
            if (prev < journey.stops.length - 1) {
              return prev + 1;
            } else {
              setIsMoving(false);
              return prev;
            }
          });
        }, 500);
        return;
      }

      const newPosition = pathSegment[pointIndex];
      busMarkerRef.current.setLatLng(newPosition);
      setBusPosition(newPosition);
      
      pointIndex++;
    }, 3000 / pathSegment.length); // Chia đều thời gian cho các điểm

    return () => clearInterval(moveInterval);
  }, [isMoving, currentStopIndex, routeCoordinates]);

  // ============================================
  // CẬP NHẬT MARKER KHI THAY ĐỔI TRẠM
  // ============================================
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Cập nhật màu sắc các marker trạm
    stationMarkersRef.current.forEach((marker, index) => {
      const stop = journey.stops[index];
      const status = getStopStatus(index);
      const isFirst = index === 0;
      const isLast = index === journey.stops.length - 1;
      
      let color = '#3b82f6'; // blue - pending
      if (status === 'completed') color = '#10b981'; // green
      if (status === 'current') color = '#fbbf24'; // yellow
      if (isFirst && status !== 'current') color = '#10b981'; // green for start
      if (isLast && status === 'pending') color = '#ef4444'; // red for end

      const icon = L.divIcon({
        className: 'custom-station-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${status === 'current' ? 'animation: pulse 1s infinite;' : ''}
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      marker.setIcon(icon);
    });
  }, [currentStopIndex]);

  // Cập nhật trạng thái các trạm dựa trên vị trí hiện tại
  const getStopStatus = (index) => {
    if (index < currentStopIndex) return 'completed';
    if (index === currentStopIndex) return 'current';
    return 'pending';
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6">
      {/* CSS cho animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theo dõi chuyến đi</h1>
          <p className="text-gray-600 mt-1">Theo dõi xe buýt theo thời gian thực</p>
        </div>
        
        {/* Nút điều khiển mô phỏng */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsMoving(!isMoving)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isMoving 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMoving ? '⏸ Tạm dừng' : '▶ Bắt đầu mô phỏng'}
          </button>
          <button
            onClick={() => {
              setCurrentStopIndex(0);
              setIsMoving(false);
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Bản đồ */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoadingRoute && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Đang tải đường đi...</p>
            </div>
          </div>
        )}
        <div 
          ref={mapRef} 
          style={{ height: '500px', width: '100%' }}
          className="relative"
        />
      </div>

      {/* Thông tin xe buýt */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Bus size={32} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{journey.routeName}</h2>
            <p className="text-gray-600">Xe {journey.busNumber} - Tài xế: {journey.driverName}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
              <Navigation size={16} className="mr-1" />
              {journey.status}
            </div>
            <p className="text-sm text-gray-600 mt-1">Bắt đầu: {journey.startTime}</p>
          </div>
        </div>

        {/* Tiến độ */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Tiến độ chuyến đi</span>
            <span className="font-medium text-gray-900">
              {currentStopIndex + 1} / {journey.stops.length} trạm
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentStopIndex + 1) / journey.stops.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline các trạm */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Lộ trình chi tiết</h3>
        
        <div className="space-y-6">
          {journey.stops.map((stop, index) => {
            const status = getStopStatus(index);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            const isPending = status === 'pending';

            return (
              <div key={stop.id} className="flex gap-4">
                {/* Timeline icon */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' :
                    isCurrent ? 'bg-blue-100 animate-pulse' :
                    'bg-gray-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : isCurrent ? (
                      <Navigation size={24} className="text-blue-600" />
                    ) : (
                      <Circle size={24} className="text-gray-400" />
                    )}
                  </div>
                  {index < journey.stops.length - 1 && (
                    <div className={`w-1 h-16 ${
                      isCompleted ? 'bg-green-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                {/* Thông tin trạm */}
                <div className={`flex-1 pb-6 ${
                  isCurrent ? 'bg-blue-50 -ml-2 pl-4 pr-4 pt-2 rounded-lg border-2 border-blue-200' : ''
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        isCurrent ? 'text-blue-900 text-lg' : 'text-gray-900'
                      }`}>
                        {stop.name}
                        {isCurrent && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                            Đang ở đây
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {stop.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock size={14} />
                        {stop.time}
                      </div>
                      {stop.students > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {stop.students} học sinh
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div className="flex items-center gap-2 mt-2">
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✓ Đã qua
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded animate-pulse">
                        → Đang đến
                      </span>
                    )}
                    {isPending && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        ○ Chưa đến
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Tổng trạm</p>
          <p className="text-2xl font-bold text-gray-900">{journey.stops.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Đã qua</p>
          <p className="text-2xl font-bold text-green-600">{currentStopIndex}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Còn lại</p>
          <p className="text-2xl font-bold text-blue-600">
            {journey.stops.length - currentStopIndex - 1}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-600">Tổng học sinh</p>
          <p className="text-2xl font-bold text-gray-900">
            {journey.stops.reduce((sum, stop) => sum + stop.students, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

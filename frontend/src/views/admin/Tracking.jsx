import React, { useState, useEffect } from 'react';
import { mockTracking, mockBuses, mockDrivers, mockRoutes } from '../../data/mockData';
import { MapPin, Navigation, Eye, EyeOff, Bell, AlertTriangle, MessageSquare, Clock, Users, Route } from 'lucide-react';
import MapView from "../../views/common/MapView";
export default function Tracking() {
  const [trackingData, setTrackingData] = useState(mockTracking);
  const [selectedBus, setSelectedBus] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [mapView, setMapView] = useState('overview'); // 'overview' or 'detailed'
  const [focusedBus, setFocusedBus] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Xe BS-003 bị chậm 5 phút do tắc đường', time: '07:12', busId: 'BS-003' },
    { id: 2, type: 'info', message: 'Xe BS-001 đã đón xong học sinh tại điểm dừng 2', time: '07:00', busId: 'BS-001' },
    { id: 3, type: 'success', message: 'Xe BS-002 đang đón học sinh tại điểm dừng 5', time: '07:15', busId: 'BS-002' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate real-time updates (SSB 1.0 requirement: max 3 seconds delay)
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setTrackingData(prevData => 
        prevData.map(bus => ({
          ...bus,
          lastUpdate: new Date().toLocaleString('vi-VN'),
          // Simulate small position changes
          coordinates: {
            lat: bus.coordinates.lat + (Math.random() - 0.5) * 0.001,
            lng: bus.coordinates.lng + (Math.random() - 0.5) * 0.001
          }
        }))
      );
      
      // Add random notifications
      if (Math.random() > 0.7) {
        const randomBus = trackingData[Math.floor(Math.random() * trackingData.length)];
        const newNotification = {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'info' : 'warning',
          message: `Xe ${randomBus.busId} cập nhật vị trí: ${randomBus.currentLocation}`,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          busId: randomBus.busId
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 3000); // Update every 3 seconds (SSB 1.0 requirement)

    return () => clearInterval(interval);
  }, [autoRefresh, trackingData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_route': return 'bg-green-100 text-green-800';
      case 'picking_up': return 'bg-blue-100 text-blue-800';
      case 'dropping_off': return 'bg-purple-100 text-purple-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'on_route': return 'Đang di chuyển';
      case 'picking_up': return 'Đang đón học sinh';
      case 'dropping_off': return 'Đang trả học sinh';
      case 'delayed': return 'Bị chậm';
      case 'stopped': return 'Dừng xe';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on_route': return '🚌';
      case 'picking_up': return '👥';
      case 'dropping_off': return '🏫';
      case 'delayed': return '⏰';
      case 'stopped': return '⏸️';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart School Bus Tracking - SSB 1.0</h1>
          <p className="text-gray-600 mt-1">Giám sát vị trí và trạng thái xe buýt theo thời gian thực (độ trễ tối đa 3 giây)</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Bell size={20} />
            Thông báo
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Tự động cập nhật (3s)</span>
          </label>
          <button
            onClick={() => setTrackingData(mockTracking)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>🔄</span>
            Làm mới
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-yellow-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell className="text-yellow-600" size={24} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Thông báo & Cảnh báo</h2>
                  <p className="text-sm text-gray-600">Cập nhật trạng thái xe buýt theo thời gian thực</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 border-b last:border-b-0 ${
                notification.type === 'warning' ? 'bg-orange-50 border-l-4 border-l-orange-400' :
                notification.type === 'success' ? 'bg-green-50 border-l-4 border-l-green-400' :
                'bg-blue-50 border-l-4 border-l-blue-400'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${
                      notification.type === 'warning' ? 'bg-orange-200' :
                      notification.type === 'success' ? 'bg-green-200' : 'bg-blue-200'
                    }`}>
                      {notification.type === 'warning' ? <AlertTriangle size={16} className="text-orange-600" /> :
                       notification.type === 'success' ? <Users size={16} className="text-green-600" /> :
                       <MessageSquare size={16} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">Xe {notification.busId} • {notification.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const bus = trackingData.find(b => b.busId === notification.busId);
                      if (bus) setFocusedBus(bus);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Xem vị trí
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Xe đang hoạt động</div>
              <div className="text-2xl font-bold text-green-600">{trackingData.length}</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◐
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Đang di chuyển</div>
              <div className="text-2xl font-bold text-blue-600">
                {trackingData.filter(b => b.status === 'on_route').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◑
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Đang đón/trả</div>
              <div className="text-2xl font-bold text-purple-600">
                {trackingData.filter(b => b.status === 'picking_up' || b.status === 'dropping_off').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◒
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Bị chậm</div>
              <div className="text-2xl font-bold text-orange-600">
                {trackingData.filter(b => b.status === 'delayed').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◓
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tổng học sinh</div>
              <div className="text-2xl font-bold text-indigo-600">
                {trackingData.reduce((total, bus) => total + bus.studentsOnBoard, 0)}
              </div>
            </div>
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" size={24} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Bản đồ theo dõi</h2>
                <p className="text-sm text-gray-600">Vị trí xe buýt theo thời gian thực</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={mapView}
                onChange={(e) => setMapView(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overview">Tổng quan</option>
                <option value="detailed">Chi tiết</option>
              </select>
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {showMap ? <EyeOff size={16} /> : <Eye size={16} />}
                {showMap ? 'Ẩn bản đồ' : 'Hiện bản đồ'}
              </button>
            </div>
          </div>
        </div>

        {showMap && (
          <div className="relative">
            {/* Map Container */}
            <div className="h-96 bg-gray-100 relative overflow-hidden">
              <MapView
                trackingData={trackingData} 
                focusedBus={focusedBus}
                setFocusedBus={setFocusedBus}
              />


              {/* Map Controls
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => alert('Phóng to bản đồ')}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600"
                    title="Phóng to"
                  >
                    ➕
                  </button>
                  <button
                    onClick={() => alert('Thu nhỏ bản đồ')}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600"
                    title="Thu nhỏ"
                  >
                    ➖
                  </button>
                  <button
                    onClick={() => alert('Làm mới vị trí')}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600"
                    title="Làm mới"
                  >
                    🔄
                  </button>
                </div>
              </div> */}

              {/* Live Status Indicator */}
              {/* <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                TRỰC TIẾP
              </div> */}

              {/* Map Overlay - Bus Markers */}
              <div className="absolute inset-0 pointer-events-none">
                {trackingData.map((bus, index) => (
                  <div
                    key={bus.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="relative group">
                      {/* Bus Icon */}
                      
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                          <div className="font-semibold">{bus.busId}</div>
                          <div>{bus.driverName}</div>
                          <div>{bus.currentLocation}</div>
                          <div className="text-gray-300">{getStatusText(bus.status)}</div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Legend */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="font-medium text-gray-700">Chú thích:</div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Đang di chuyển</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Đang đón học sinh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Đang trả học sinh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span>Bị chậm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Dừng xe</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tracking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trackingData.map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getStatusIcon(bus.status)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bus.busId}</h3>
                  <p className="text-sm text-gray-600">{bus.driverName}</p>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(bus.status)}`}>
                {getStatusText(bus.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tuyến đường:</span>
                <span className="text-sm font-medium text-gray-900">{bus.routeName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vị trí hiện tại:</span>
                <span className="text-sm font-medium text-gray-900">{bus.currentLocation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Điểm dừng tiếp theo:</span>
                <span className="text-sm font-medium text-gray-900">{bus.nextStop}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dự kiến đến:</span>
                <span className="text-sm font-medium text-gray-900">{bus.estimatedArrival}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tốc độ:</span>
                <span className={`text-sm font-medium ${bus.speed > 30 ? 'text-green-600' : bus.speed > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {bus.speed} km/h
                </span>
              </div>
              <div className="flex justify-between items-center">
                
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Học sinh trên xe:</span>
                <span className="text-sm font-medium text-gray-900">{bus.studentsOnBoard} học sinh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tọa độ GPS:</span>
                <span className="text-sm text-gray-500 font-mono">
                  {bus.coordinates.lat.toFixed(4)}, {bus.coordinates.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                <span className="text-sm text-gray-500">{bus.lastUpdate}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setSelectedBus(bus)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => setFocusedBus(bus)}
                  className="bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Navigation size={16} />
                  Định vị
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const message = prompt(`Gửi tin nhắn cho tài xế ${bus.driverName}:`);
                    if (message) {
                      alert(`Đã gửi tin nhắn: "${message}" cho tài xế ${bus.driverName}`);
                      const newNotification = {
                        id: Date.now(),
                        type: 'info',
                        message: `Đã gửi tin nhắn cho tài xế ${bus.driverName}`,
                        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        busId: bus.busId
                      };
                      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
                    }
                  }}
                  className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-1 px-3 rounded text-sm transition-colors flex items-center gap-1"
                >
                  <MessageSquare size={14} />
                  Nhắn tài xế
                </button>
                <button
                  onClick={() => {
                    alert(`Đã gửi thông báo cho phụ huynh về xe ${bus.busId}: "Xe đang ở ${bus.currentLocation}, dự kiến đến ${bus.nextStop} lúc ${bus.estimatedArrival}"`);
                    const newNotification = {
                      id: Date.now(),
                      type: 'success',
                      message: `Đã thông báo phụ huynh về xe ${bus.busId}`,
                      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                      busId: bus.busId
                    };
                    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
                  }}
                  className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-1 px-3 rounded text-sm transition-colors flex items-center gap-1"
                >
                  <Bell size={14} />
                  Báo PH
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Focus Modal */}
      {focusedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Navigation className="text-green-600" size={24} />
                <div>
                  <h2 className="text-2xl font-bold">Định vị xe {focusedBus.busId}</h2>
                  <p className="text-gray-600">Vị trí chi tiết và lộ trình</p>
                </div>
              </div>
              <button
                onClick={() => setFocusedBus(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Detailed Map */}
            <div className="mb-4">
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden relative">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326!2d106.6297!3d10.8231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Detailed map for ${focusedBus.busId}`}
                ></iframe>
                
                {/* Bus marker overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                      🚌
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {focusedBus.busId}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin xe</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã xe:</span>
                    <span className="font-medium">{focusedBus.busId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tài xế:</span>
                    <span className="font-medium">{focusedBus.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tuyến:</span>
                    <span className="font-medium">{focusedBus.routeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(focusedBus.status)}`}>
                      {getStatusText(focusedBus.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Vị trí hiện tại</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Điểm hiện tại:</span>
                    <span className="font-medium">{focusedBus.currentLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Điểm tiếp theo:</span>
                    <span className="font-medium">{focusedBus.nextStop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dự kiến đến:</span>
                    <span className="font-medium">{focusedBus.estimatedArrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Học sinh:</span>
                    <span className="font-medium">{focusedBus.studentsOnBoard} người</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {focusedBus.status === 'delayed' && (
                  <button
                    onClick={() => {
                      alert(`Đã gửi cảnh báo tự động cho phụ huynh: "Xe ${focusedBus.busId} bị chậm, dự kiến đến muộn 5-10 phút"`);
                      const newNotification = {
                        id: Date.now(),
                        type: 'warning',
                        message: `Đã gửi cảnh báo xe ${focusedBus.busId} bị trễ cho phụ huynh`,
                        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        busId: focusedBus.busId
                      };
                      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                  >
                    <AlertTriangle size={16} />
                    Cảnh báo trễ
                  </button>
                )}
                <button
                  onClick={() => {
                    const message = prompt(`Gửi tin nhắn cho tài xế ${focusedBus.driverName}:`);
                    if (message) {
                      alert(`Đã gửi tin nhắn: "${message}"`);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Nhắn tài xế
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Simulate sharing location
                    navigator.clipboard.writeText(`Vị trí xe ${focusedBus.busId}: ${focusedBus.currentLocation} (${focusedBus.coordinates.lat}, ${focusedBus.coordinates.lng})`);
                    alert('Đã sao chép vị trí vào clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Chia sẻ vị trí
                </button>
                <button
                  onClick={() => setFocusedBus(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chi tiết xe {selectedBus.busId}</h2>
              <button
                onClick={() => setSelectedBus(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tài xế</label>
                  <p className="text-sm text-gray-900">{selectedBus.driverName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tuyến đường</label>
                  <p className="text-sm text-gray-900">{selectedBus.routeName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vị trí hiện tại</label>
                  <p className="text-sm text-gray-900">{selectedBus.currentLocation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Điểm dừng tiếp theo</label>
                  <p className="text-sm text-gray-900">{selectedBus.nextStop}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dự kiến đến</label>
                  <p className="text-sm text-gray-900">{selectedBus.estimatedArrival}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Học sinh trên xe</label>
                  <p className="text-sm text-gray-900">{selectedBus.studentsOnBoard} học sinh</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBus.status)}`}>
                  {getStatusText(selectedBus.status)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
                <p className="text-sm text-gray-900">{selectedBus.lastUpdate}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setSelectedBus(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { mockStudents, mockTracking, mockParents } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Clock, Navigation, User, Phone, RefreshCw } from 'lucide-react';

export default function ParentTracking() {
  const { user } = useAuth();
  const [myChildren, setMyChildren] = useState([]);
  const [busInfo, setBusInfo] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate finding parent's children
    const parentInfo = mockParents.find(p => p.name.includes(user?.name?.split(' ')[0] || 'Nguyễn'));
    const children = mockStudents.filter(student => student.parentId === (parentInfo?.id || 1));
    setMyChildren(children);
    
    // Get bus info for the first child
    if (children.length > 0) {
      const childBus = mockTracking.find(bus => bus.busId === children[0].busId);
      setBusInfo(childBus);
    }
  }, [user]);

  // Auto refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In real app, this would fetch new data from API
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getBusStatusColor = (status) => {
    switch (status) {
      case 'on_route': return 'text-green-600 bg-green-100';
      case 'picking_up': return 'text-blue-600 bg-blue-100';
      case 'dropping_off': return 'text-purple-600 bg-purple-100';
      case 'delayed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBusStatusText = (status) => {
    switch (status) {
      case 'on_route': return 'Đang di chuyển';
      case 'picking_up': return 'Đang đón học sinh';
      case 'dropping_off': return 'Đang trả học sinh';
      case 'delayed': return 'Bị chậm';
      default: return 'Không xác định';
    }
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // In real app, this would trigger API call
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Theo dõi xe buýt</h1>
            <p className="text-blue-100 mt-1">Vị trí và trạng thái xe buýt thời gian thực</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Làm mới
            </button>
            <div className="text-right">
              <div className="text-sm text-blue-100">Cập nhật lần cuối</div>
              <div className="font-medium">{lastUpdate.toLocaleTimeString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Children Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myChildren.map((child) => (
          <div key={child.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {child.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
                <p className="text-gray-600">{child.grade} • {child.studentId}</p>
                <p className="text-sm text-gray-500">{child.address}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Xe buýt:</span>
                <span className="font-medium text-gray-900">{child.busId || 'Chưa phân công'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giờ đón:</span>
                <span className="font-medium text-gray-900">{child.pickupTime || 'Chưa có'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giờ trả:</span>
                <span className="font-medium text-gray-900">{child.dropoffTime || 'Chưa có'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bus Tracking */}
      {busInfo ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-blue-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Navigation className="text-blue-600" size={24} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Xe buýt {busInfo.busId}</h2>
                  <p className="text-gray-600">Vị trí và trạng thái hiện tại</p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(!showMap)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {showMap ? 'Ẩn bản đồ' : 'Xem bản đồ'}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 text-blue-600" size={32} />
                <div className="text-sm text-gray-500">Vị trí hiện tại</div>
                <div className="font-semibold text-gray-900">{busInfo.currentLocation}</div>
              </div>
              <div className="text-center">
                <Navigation className="mx-auto mb-2 text-green-600" size={32} />
                <div className="text-sm text-gray-500">Điểm tiếp theo</div>
                <div className="font-semibold text-gray-900">{busInfo.nextStop}</div>
              </div>
              <div className="text-center">
                <Clock className="mx-auto mb-2 text-orange-600" size={32} />
                <div className="text-sm text-gray-500">Dự kiến đến</div>
                <div className="font-semibold text-gray-900">{busInfo.estimatedArrival}</div>
              </div>
              <div className="text-center">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getBusStatusColor(busInfo.status)}`}>
                  {getBusStatusText(busInfo.status)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Trạng thái</div>
              </div>
            </div>

            {/* Map */}
            {showMap && (
              <div className="mb-6">
                <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326!2d106.6297!3d10.8231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bus Location"
                  ></iframe>
                  
                  {/* Bus marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                      🚌
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User size={20} />
                Thông tin tài xế
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tên tài xế:</span>
                  <span className="ml-2 font-medium">{busInfo.driverName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tuyến đường:</span>
                  <span className="ml-2 font-medium">{busInfo.routeName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tốc độ:</span>
                  <span className="ml-2 font-medium">{busInfo.speed} km/h</span>
                </div>
                <div>
                  <span className="text-gray-600">Cập nhật:</span>
                  <span className="ml-2 font-medium">{busInfo.lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Navigation className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có thông tin xe buýt
          </h3>
          <p className="text-gray-600">
            Con em chưa được phân công xe buýt hoặc xe buýt chưa hoạt động.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => alert('Đang gọi cho nhà trường...')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-3"
          >
            <Phone size={20} />
            Gọi cho nhà trường
          </button>
          <button
            onClick={() => {
              if (busInfo) {
                alert(`Đang gọi cho tài xế ${busInfo.driverName}...`);
              }
            }}
            className="bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-3"
          >
            <Phone size={20} />
            Gọi cho tài xế
          </button>
        </div>
      </div>
    </div>
  );
}
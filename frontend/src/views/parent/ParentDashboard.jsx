import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Clock, Navigation, User, Phone } from 'lucide-react';

// Giả định URL cơ sở của API backend
const API_BASE_URL = 'http://localhost:5000/api'; 

export default function ParentDashboard() {
    // Lấy user, token, và loading từ AuthContext
    const { user, token, logout, loading: authLoading } = useAuth(); 
    const [myChildren, setMyChildren] = useState([]);
    const [busInfo, setBusInfo] = useState(null); // Dữ liệu sẽ được lấy từ API Tracking
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);

    // Hàm lấy trạng thái và màu sắc xe buýt (Giữ nguyên)
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

    // Hàm chính để fetch dữ liệu dashboard
    const fetchDashboardData = useCallback(async (parentMaPH, authToken) => {
        if (!parentMaPH || !authToken) {
             setDashboardLoading(false);
             return;
        }

        setDashboardLoading(true);
        setError(null);

        try {
            // 1. GỌI API LẤY DANH SÁCH HỌC SINH
            const childrenResponse = await axios.get(`${API_BASE_URL}/parents/${parentMaPH}/children`, {
                headers: {
                    Authorization: `Bearer ${authToken}` // Gửi token
                }
            });
            
            const childrenData = childrenResponse.data;
            setMyChildren(childrenData);
            
            // 2. GỌI API LẤY THÔNG TIN THEO DÕI XE BUÝT
            if (childrenData.length > 0 && childrenData[0].MaTram) {
                const maTram = childrenData[0].MaTram; 
                
                // 💡 API Tracking thực tế: /tracking/:MaTram (endpoint này cần được bạn tự định nghĩa)
                const trackingResponse = await axios.get(`${API_BASE_URL}/tracking/${maTram}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                
                // Giả định API trả về busInfo có các trường cần thiết
                setBusInfo(trackingResponse.data);
                
            } else {
                setBusInfo(null);
            }

        } catch (err) {
            console.error("Lỗi khi fetch dữ liệu Dashboard:", err);
            
            if (err.response && err.response.status === 401) {
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                logout();
            } else {
                 // Đặt busInfo về null nếu API Tracking hoặc Children gặp lỗi
                 setBusInfo(null); 
                 setError("Lỗi khi tải dữ liệu. Vui lòng kiểm tra API /parents/children và /tracking/.");
            }
        } finally {
            setDashboardLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        // Chỉ chạy khi AuthContext đã tải xong và có user/token
        if (!authLoading && user && token) {
            fetchDashboardData(user.MaPH, token); // Giả định user object có MaPH
        } else if (!authLoading && !user) {
             setDashboardLoading(false);
        }
    }, [authLoading, user, token, fetchDashboardData]);


    if (authLoading || dashboardLoading) {
        return <div className="p-8 text-center text-lg font-medium text-gray-500">Đang tải dữ liệu...</div>;
    }
    
    if (error) {
        return <div className="p-8 text-center text-lg font-medium text-red-600">⚠️ {error}</div>;
    }

    // --- RENDER GIAO DIỆN ---
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Chào {user?.name || 'Phụ huynh'}!</h1>
              <p className="text-green-100 mt-1">Theo dõi hành trình đưa đón con em - {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{myChildren.length}</div>
              <div className="text-green-100">Con em</div>
            </div>
          </div>
        </div>

        {/* Children Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myChildren.map((child) => (
            <div key={child.MaHS} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {child.TenHS.charAt(0)}
                </div>
                <div>
                  {/* Dữ liệu từ API ParentModel.getChildren */}
                  <h3 className="text-xl font-semibold text-gray-900">{child.TenHS}</h3>
                  <p className="text-gray-600">Lớp: {child.Lop} • Mã HS: **{child.MaHS}**</p>
                  <p className="text-sm text-gray-500">Trạm đón: **{child.TenTram || 'Chưa phân công'}**</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tuyến đường:</span>
                  <span className="font-medium text-gray-900">{child.TenTuyenDuong || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Xe buýt:</span>
                  <span className="font-medium text-gray-900">{busInfo?.busId || 'Đang chờ'}</span>
                </div>
                {/* Giờ đón/Giờ trả cần API lịch trình */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Giờ đón (Dự kiến):</span>
                  <span className="font-medium text-gray-900">N/A</span> 
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bus Tracking (Chỉ hiển thị nếu busInfo có dữ liệu từ API) */}
        {busInfo ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b bg-blue-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Navigation className="text-blue-600" size={24} />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Theo dõi xe buýt {busInfo.busId}</h2>
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
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-700">
                <p className="font-medium">🚌 Không tìm thấy thông tin theo dõi xe buýt hiện tại.</p>
                <p className="text-sm mt-1">Kiểm tra API /tracking/:MaTram và đảm bảo học sinh được phân công trạm.</p>
             </div>
        )}
      </div>
    );
}
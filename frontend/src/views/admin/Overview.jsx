import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Bus,
  Users,
  Route,
  User,
  MapPin,
  Calendar,
  Clock,
  Bell,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = 'http://localhost:5000/api';

const OverviewDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data
  const [stats] = useState({
    totalStudents: 120,
    activeBuses: 5,
    totalDrivers: 8,
    totalRoutes: 6,
    totalStations: 3,
    totalSchedule: 5,
  });

  const [incidents, setIncidents] = useState([]);
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);

  // Socket.IO Realtime
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('🔌 Admin connected to socket');
      socket.emit('join-admin-room');
    });
    
    socket.on('admin-update', (data) => {
      console.log('📢 Admin nhận update:', data);
      
      if (data.type === 'attendance') {
        setRealtimeNotifications(prev => [data.data, ...prev].slice(0, 10));
      }
    });
    
    return () => socket.disconnect();
  }, []);

  // Fetch incidents
  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Giả sử có API endpoint để lấy báo cáo sự cố
      // Nếu chưa có, sẽ cần tạo backend API
      const res = await axios.get(`${API_URL}/incidents`, config);
      
      console.log('[Overview] Incidents:', res.data);
      setIncidents(res.data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      // Nếu API chưa có, set empty array
      setIncidents([]);
    }
  };

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Cập nhật dữ liệu...");
      fetchIncidents();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchIncidents();
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen text-gray-800 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
          <p className="text-gray-600 text-sm mt-1">
            Theo dõi hoạt động hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Làm mới</span>
          </button>
        </div>
      </div>

      {/* THÔNG BÁO REALTIME */}
      {realtimeNotifications.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Bell className="text-green-600 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-2">Điểm danh mới nhất</h3>
              <div className="space-y-2">
                {realtimeNotifications.slice(0, 3).map((notif, index) => (
                  <div key={index} className="text-sm text-gray-700 bg-white/50 p-2 rounded">
                    🔔 {notif.NoiDung}
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(notif.ThoiGian).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THỐNG KÊ NHANH */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<Users size={20} />} label="Học sinh" value={stats.totalStudents} />
        <StatCard icon={<User size={20} />} label="Tài xế" value={stats.totalDrivers} />
        <StatCard icon={<Bus size={20} />} label="Xe hoạt động" value={stats.activeBuses} />
        <StatCard icon={<Route size={20} />} label="Tuyến đường" value={stats.totalRoutes} />
        <StatCard icon={<MapPin size={20} />} label="Trạm" value={stats.totalStations} />
        <StatCard icon={<Calendar size={20} />} label="Lịch trình" value={stats.totalSchedule} />
      </div>

      {/* BÁO CÁO SỰ CỐ */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold flex items-center gap-2">
            <Bell className="text-red-600" size={20} />
            Báo cáo sự cố
          </h2>
          <span className="text-sm text-gray-500">
            {incidents.length} sự cố
          </span>
        </div>
        <div className="p-4">
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bell size={48} className="mx-auto mb-2 opacity-50" />
              <p>Không có sự cố nào được báo cáo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.slice(0, 10).map(incident => (
                <div key={incident.MaCB} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                          Sự cố
                        </span>
                        <span className="text-xs text-gray-500">
                          {incident.MaCB}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {incident.NoiDungSuCo}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        {incident.TenTuyenDuong && (
                          <span className="flex items-center gap-1">
                            <Route size={12} />
                            {incident.TenTuyenDuong}
                          </span>
                        )}
                        {incident.TenTX && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {incident.TenTX}
                          </span>
                        )}
                        {incident.BienSo && (
                          <span className="flex items-center gap-1">
                            <Bus size={12} />
                            {incident.BienSo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

// Component hiển thị card thống kê
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="text-gray-600">{icon}</div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-gray-600 text-sm">{label}</div>
      </div>
    </div>
  </div>
);

export default OverviewDashboard;

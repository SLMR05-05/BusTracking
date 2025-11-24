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
  Navigation,
  Clock,
} from "lucide-react";
import axios from "axios";

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

  const [runningSchedules, setRunningSchedules] = useState([]);

  // Fetch running schedules
  useEffect(() => {
    fetchRunningSchedules();
  }, []);

  const fetchRunningSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(`${API_URL}/schedules`, config);
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Filter schedules that are running today
      const running = res.data.filter(schedule => {
        const scheduleDate = schedule.NgayChay?.split('T')[0];
        return scheduleDate === today;
      });
      
      setRunningSchedules(running);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  // Auto refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Cập nhật dữ liệu...");
      fetchRunningSchedules();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchRunningSchedules();
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

      {/* THỐNG KÊ NHANH */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<Users size={20} />} label="Học sinh" value={stats.totalStudents} />
        <StatCard icon={<User size={20} />} label="Tài xế" value={stats.totalDrivers} />
        <StatCard icon={<Bus size={20} />} label="Xe hoạt động" value={stats.activeBuses} />
        <StatCard icon={<Route size={20} />} label="Tuyến đường" value={stats.totalRoutes} />
        <StatCard icon={<MapPin size={20} />} label="Trạm" value={stats.totalStations} />
        <StatCard icon={<Calendar size={20} />} label="Lịch trình" value={stats.totalSchedule} />
      </div>

      {/* LỊCH TRÌNH ĐANG CHẠY */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold flex items-center gap-2">
            <Navigation className="text-blue-600" size={20} />
            Lịch trình đang chạy hôm nay
          </h2>
          <span className="text-sm text-gray-500">
            {runningSchedules.length} lịch trình
          </span>
        </div>
        <div className="p-4">
          {runningSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bus size={48} className="mx-auto mb-2 opacity-50" />
              <p>Không có lịch trình nào đang chạy</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {runningSchedules.map(schedule => (
                <div key={schedule.MaLT} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{schedule.TenTuyenDuong}</h3>
                      <p className="text-sm text-gray-600 mt-1">Xe: {schedule.BienSo}</p>
                      <p className="text-sm text-gray-600">Tài xế: {schedule.TenTX}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      Đang chạy
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Clock size={14} />
                    <span>{schedule.GioBatDau?.substring(0, 5)} - {schedule.GioKetThuc?.substring(0, 5)}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/schedule-tracking/${schedule.MaLT}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <MapPin size={16} />
                    Theo dõi
                  </button>
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

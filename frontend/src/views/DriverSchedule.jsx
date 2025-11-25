import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertTriangle, BarChart3, Navigation, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = 'http://localhost:5000/api';

export default function DriverSchedule() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách lịch trình
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');
        
        if (!authToken) {
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        const res = await axios.get(`${API_BASE_URL}/driver-dashboard/schedules`, config);
        
        console.log('📋 [DriverSchedule] API Response:', res.data);
        
        const processed = res.data.map(s => {
          console.log('Processing schedule:', { MaLT: s.MaLT, type: typeof s.MaLT });
          
          // Format date: 2025-11-23T17:00:00.000Z -> 24/11/2025
          let formattedDate = s.NgayChay;
          if (s.NgayChay) {
            // Parse date string directly to avoid timezone issues
            const dateStr = s.NgayChay.split('T')[0]; // Get "2025-11-23"
            const [year, month, day] = dateStr.split('-');
            formattedDate = `${day}/${month}/${year}`;
          }
          
          // Format time: ensure HH:MM format
          const formatTime = (timeStr) => {
            if (!timeStr) return '';
            // If it's already HH:MM, return as is
            if (timeStr.length === 5 && timeStr.includes(':')) return timeStr;
            // If it's HH:MM:SS, take first 5 chars
            return timeStr.substring(0, 5);
          };
          
          return {
            id: s.MaLT,
            date: formattedDate,
            route: s.TenTuyenDuong,
            busCode: s.BienSo,
            startTime: formatTime(s.GioBatDau),
            endTime: formatTime(s.GioKetThuc),
            status: s.TrangThai || 'pending'
          };
        });
        
        console.log('✅ [DriverSchedule] Processed schedules:', processed.map(p => ({ id: p.id, route: p.route })));
        setSchedules(processed);
      } catch (err) {
        console.error("Lỗi tải lịch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [token]);

  const getStatusBadge = (status) => {
    if (status === 'completed') return { text: 'Đã xong', color: 'bg-green-100 text-green-700' };
    if (status === 'running') return { text: 'Đang chạy', color: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Sắp tới', color: 'bg-gray-100 text-gray-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Danh Sách Lịch Trình</h1>
          <p className="text-gray-500 text-sm mt-1">Chọn lịch trình để bắt đầu chạy</p>
        </div>

        {/* Empty State */}
        {!loading && schedules.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertTriangle className="text-yellow-600 mx-auto mb-3" size={48} />
            <h3 className="font-bold text-yellow-800 text-lg">Chưa có lịch chạy</h3>
            <p className="text-sm text-yellow-700 mt-2">
              Tài xế <span className="font-bold">{user?.username}</span> chưa được phân công lịch chạy nào.
            </p>
          </div>
        )}

        {/* Schedule List */}
        <div className="space-y-4">
          {schedules.map((schedule) => {
            const badge = getStatusBadge(schedule.status);
            return (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300"
              >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b-2 border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          #{schedule.id}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-xl mb-3">{schedule.route}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="font-medium">{schedule.date}</span>
                        <span>•</span>
                        <span className="font-medium">{schedule.startTime} - {schedule.endTime}</span>
                        <span>•</span>
                        <span className="font-medium">{schedule.busCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="p-3 bg-gray-50 flex gap-2 justify-end">
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/driver-dashboard/${schedule.id}`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all text-xs font-medium"
                  >
                    <BarChart3 size={14} />
                    Dashboard
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/driver-tracking/${schedule.id}`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-xs font-medium"
                  >
                    <Navigation size={14} />
                    Tracking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Navigation, Users, MapPin, CheckCircle, 
  Circle, Play, AlertTriangle 
} from "lucide-react";
import io from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import RouteMap from "../../components/RouteMap"; 

const API_BASE_URL = 'http://localhost:5000/api';
const socket = io("http://localhost:5000");

// Hàm tính khoảng cách giữa 2 điểm GPS (đơn vị: mét)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
};

export default function DriverTracking() {
  const { user, token } = useAuth();
  const { scheduleId } = useParams();
  
  // State Quản lý
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [stops, setStops] = useState([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isAtStop, setIsAtStop] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu lịch chạy theo scheduleId
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');
        if (!authToken) return;

        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        
        // Nếu có scheduleId từ URL, lấy lịch cụ thể
        let schedule;
        if (scheduleId) {
          console.log('🔍 [DriverTracking] Fetching schedule with ID:', scheduleId, 'Type:', typeof scheduleId);
          const scheduleRes = await axios.get(
            `${API_BASE_URL}/driver-dashboard/schedules`, 
            config
          );
          console.log('📋 [DriverTracking] Total schedules:', scheduleRes.data.length);
          console.log('📋 [DriverTracking] All MaLT values:', scheduleRes.data.map(s => `${s.MaLT} (${typeof s.MaLT})`));
          
          // So sánh bằng string
          schedule = scheduleRes.data.find(s => {
            const match = String(s.MaLT).trim() === String(scheduleId).trim();
            console.log(`Comparing: "${s.MaLT}" === "${scheduleId}" => ${match}`);
            return match;
          });
          
          if (schedule) {
            console.log('✅ [DriverTracking] Found schedule:', {
              MaLT: schedule.MaLT,
              TenTuyenDuong: schedule.TenTuyenDuong,
              NgayChay: schedule.NgayChay
            });
          } else {
            console.error('❌ [DriverTracking] Schedule NOT found for ID:', scheduleId);
            setCurrentSchedule(null);
            setStops([]);
            setStudents([]);
            setLoading(false);
            return;
          }
        } else {
          // Nếu không có scheduleId, lấy lịch hôm nay (fallback)
          const offset = new Date().getTimezoneOffset() * 60000;
          const dateStr = new Date(Date.now() - offset).toISOString().split('T')[0];
          const scheduleRes = await axios.get(
            `${API_BASE_URL}/driver-dashboard/schedules?date=${dateStr}`, 
            config
          );
          if (!scheduleRes.data || scheduleRes.data.length === 0) {
            setCurrentSchedule(null);
            setStops([]);
            setStudents([]);
            setLoading(false);
            return;
          }
          schedule = scheduleRes.data[0];
        }
        
        setCurrentSchedule(schedule);

        // Lấy danh sách trạm và học sinh
        const [stopsRes, studentsRes, attendanceRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/driver-dashboard/schedules/${schedule.MaLT}/stops`, config),
          axios.get(`${API_BASE_URL}/driver-dashboard/schedules/${schedule.MaLT}/students`, config),
          axios.get(`${API_BASE_URL}/driver-dashboard/schedules/${schedule.MaLT}/attendance`, config)
        ]);

        // Xử lý dữ liệu trạm
        const processedStops = stopsRes.data.map(stop => ({
          id: stop.MaTram,
          detailId: stop.MaCTLT,
          name: stop.TenTram,
          address: stop.DiaChi,
          lat: parseFloat(stop.ViDo),
          lng: parseFloat(stop.KinhDo),
          order: stop.ThuTu,
          status: stop.TrangThaiQua === '1' ? 'completed' : 'pending'
        }));
        setStops(processedStops);

        // Tìm trạm hiện tại (trạm đầu tiên chưa hoàn thành)
        const currentIndex = processedStops.findIndex(s => s.status === 'pending');
        setCurrentStopIndex(currentIndex >= 0 ? currentIndex : 0);

        // Xử lý dữ liệu học sinh
        const processedStudents = studentsRes.data.map(std => {
          const record = attendanceRes.data.find(r => r.MaHS === std.MaHS);
          return {
            id: std.MaHS,
            name: std.TenHS,
            class: std.Lop,
            stopId: std.MaTram,
            stopName: std.TenTram,
            status: record ? record.TrangThai : '0',
            avatar: std.TenHS?.charAt(0) || 'U'
          };
        });
        setStudents(processedStudents);

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [user, token, scheduleId]);

  // Đã gỡ bỏ GPS tracking tự động

  // Xử lý khi xe đến trạm
  const handleArriveAtStop = () => {
    setIsAtStop(true);
    setStops(prev => prev.map((s, i) => i === currentStopIndex ? { ...s, status: 'arrived' } : s));
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  // Xử lý khi rời trạm
  const handleDepartStop = async () => {
    try {
      const authToken = token || localStorage.getItem('token');
      const currentStop = stops[currentStopIndex];
      
      // Cập nhật trạng thái trạm đã qua
      await axios.put(
        `${API_BASE_URL}/schedules/details/${currentStop.detailId}/status`,
        { status: '1' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      // Cập nhật UI
      setStops(prev => prev.map((s, i) => i === currentStopIndex ? { ...s, status: 'completed' } : s));
      
      // Chuyển sang trạm kế tiếp
      if (currentStopIndex < stops.length - 1) {
        setCurrentStopIndex(prev => prev + 1);
        setIsAtStop(false);
      } else {
        alert("Đã hoàn thành tất cả các trạm của lộ trình!");
        setIsAtStop(false);
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạm:", err);
      alert("Có lỗi xảy ra khi cập nhật trạng thái trạm!");
    }
  };

  // Điểm danh học sinh (Toggle: Chưa hoàn thành <-> Hoàn thành)
  const toggleStudentStatus = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      const newStatus = student.status === "2" ? "0" : "2"; // Toggle giữa 0 và 2
      
      const authToken = token || localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/driver-dashboard/schedules/${currentSchedule.MaLT}/students/${studentId}/attendance`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, status: newStatus } : s
      ));
    } catch (err) {
      console.error("Lỗi cập nhật điểm danh:", err);
      alert("Có lỗi xảy ra khi cập nhật điểm danh!");
    }
  };

  // Lọc học sinh tại trạm hiện tại
  const currentStopStudents = useMemo(() => {
    if (currentStopIndex >= stops.length) return [];
    const currentStopId = stops[currentStopIndex].id;
    return students.filter(s => s.stopId === currentStopId);
  }, [students, currentStopIndex, stops]);

  const completedCount = currentStopStudents.filter(s => s.status === "2").length;

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

  if (!currentSchedule) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Không có lịch chạy hôm nay</h2>
          <p className="text-gray-500 mt-2">Vui lòng liên hệ quản lý để được phân công lịch chạy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-4">
      
      {/* CỘT TRÁI: BẢN ĐỒ */}
      <div className="w-full md:w-3/5 h-[400px] md:h-full flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Navigation className="text-blue-600" size={20}/> Bản đồ lộ trình
            </h2>
            {stops[currentStopIndex] && (
              <p className="text-sm text-blue-600 mt-1">
                Đang hướng đến: <span className="font-bold">{stops[currentStopIndex].name}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => alert('Chức năng báo cáo sự cố')}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all font-semibold shadow-sm"
          >
            <AlertTriangle size={18} />
            Báo cáo sự cố
          </button>
        </div>

        <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden shadow-inner border border-gray-300 relative">
          <RouteMap 
            stops={stops}
            currentPosition={currentPosition}
          />
          
          {!isAtStop && (
            <div className="absolute bottom-4 right-4 z-[1000]">
              <button 
                onClick={handleArriveAtStop}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm"
              >
                Đã đến trạm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: THÔNG TIN TRẠM & HỌC SINH */}
      <div className="w-full md:w-2/5 flex flex-col gap-4 h-full overflow-hidden">
        
        {!isAtStop ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-bold text-gray-800">Lộ trình chuyến đi</h3>
              <p className="text-xs text-gray-500">Danh sách các điểm dừng sắp tới</p>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-6">
              {stops.map((stop, index) => {
                const isPast = index < currentStopIndex;
                const isCurrent = index === currentStopIndex;
                
                return (
                  <div key={stop.id} className="relative pl-8">
                    {index !== stops.length - 1 && (
                      <div className={`absolute left-[11px] top-7 w-0.5 h-full ${
                        isPast ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                    
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-white ${
                      isPast ? 'border-green-500 text-green-500' : 
                      isCurrent ? 'border-blue-500 text-blue-500 animate-pulse' : 
                      'border-gray-300 text-gray-300'
                    }`}>
                      {isPast ? (
                        <CheckCircle size={14} fill="currentColor" className="text-white"/>
                      ) : (
                        <Circle size={10} fill="currentColor"/>
                      )}
                    </div>

                    <div className={`${isCurrent ? 'opacity-100' : 'opacity-60'}`}>
                      <h4 className={`text-sm font-bold ${
                        isCurrent ? 'text-blue-700' : 'text-gray-800'
                      }`}>{stop.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {stop.address}
                        </span>
                        {isCurrent && (
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            Đang đến
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 flex-1 flex flex-col overflow-hidden relative">
            <div className="p-5 bg-blue-600 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
                    Đang dừng tại
                  </div>
                  <h2 className="text-xl font-bold">{stops[currentStopIndex]?.name}</h2>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <MapPin className="text-white" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="bg-blue-800 px-3 py-1 rounded-full">
                  {completedCount}/{currentStopStudents.length} Hoàn thành
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
              {currentStopStudents.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  Không có học sinh nào ở trạm này.
                </div>
              ) : (
                <div className="space-y-2">
                  {currentStopStudents.map((std) => {
                    const isCompleted = std.status === "2";
                    return (
                      <div 
                        key={std.id} 
                        onClick={() => toggleStudentStatus(std.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                          isCompleted ? 'bg-green-50 border-green-200' : 
                          'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {std.avatar}
                          </div>
                          <div>
                            <div className={`font-bold ${
                              isCompleted ? 'text-green-800' : 'text-gray-800'
                            }`}>{std.name}</div>
                            <div className="text-xs text-gray-500">Lớp {std.class}</div>
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted ? 'bg-green-500 text-white' : 
                          'bg-gray-100 text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-500'
                        }`}>
                          <CheckCircle size={20} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={handleDepartStop}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                Tiếp tục hành trình <Play size={20} fill="currentColor"/>
              </button>
              {completedCount < currentStopStudents.length && (
                <p className="text-center text-xs text-orange-500 mt-2 flex items-center justify-center gap-1">
                  <AlertTriangle size={12}/> Chú ý: Còn {currentStopStudents.length - completedCount} học sinh chưa hoàn thành
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

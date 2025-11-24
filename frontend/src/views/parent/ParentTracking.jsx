import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Clock, Navigation, User, Phone, RefreshCw, Bus, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import RouteMap from '../../components/RouteMap';

const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');

export default function ParentTracking() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');
  
  const [myChildren, setMyChildren] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [stops, setStops] = useState([]);
  const [students, setStudents] = useState([]);
  const [busPosition, setBusPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');
        if (!authToken) return;

        const config = { headers: { Authorization: `Bearer ${authToken}` } };

        // Lấy danh sách con
        const childrenRes = await axios.get(`${API_URL}/parents/me/students`, config);
        setMyChildren(childrenRes.data);

        // Nếu có scheduleId, lấy thông tin lịch trình
        if (scheduleId) {
          const scheduleRes = await axios.get(`${API_URL}/driver-dashboard/schedules/${scheduleId}`, config);
          setCurrentSchedule(scheduleRes.data);

          // Lấy danh sách trạm
          const stopsRes = await axios.get(`${API_URL}/driver-dashboard/schedules/${scheduleId}/stops`, config);
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

          // Lấy danh sách học sinh và điểm danh
          const [studentsRes, attendanceRes] = await Promise.all([
            axios.get(`${API_URL}/driver-dashboard/schedules/${scheduleId}/students`, config),
            axios.get(`${API_URL}/driver-dashboard/schedules/${scheduleId}/attendance`, config)
          ]);

          const processedStudents = studentsRes.data.map(std => {
            const record = attendanceRes.data.find(r => r.MaHS === std.MaHS);
            return {
              id: std.MaHS,
              name: std.TenHS,
              class: std.Lop,
              stopId: std.MaTram,
              stopName: std.TenTram,
              status: record ? record.TrangThai : '0'
            };
          });
          setStudents(processedStudents);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, scheduleId]);

  // Lắng nghe vị trí xe bus theo thời gian thực
  useEffect(() => {
    if (!scheduleId) return;

    socket.emit('join-schedule', scheduleId);

    socket.on('bus-location-update', (data) => {
      if (data.scheduleId === scheduleId) {
        setBusPosition({
          lat: data.latitude,
          lng: data.longitude
        });
        setLastUpdate(new Date());
      }
    });

    socket.on('stop-status-update', (data) => {
      if (data.scheduleId === scheduleId) {
        setStops(prev => prev.map(stop => 
          stop.detailId === data.detailId 
            ? { ...stop, status: data.status === '1' ? 'completed' : 'pending' }
            : stop
        ));
      }
    });

    socket.on('attendance-update', (data) => {
      if (data.scheduleId === scheduleId) {
        setStudents(prev => prev.map(std =>
          std.id === data.studentId
            ? { ...std, status: data.status }
            : std
        ));
      }
    });

    return () => {
      socket.emit('leave-schedule', scheduleId);
      socket.off('bus-location-update');
      socket.off('stop-status-update');
      socket.off('attendance-update');
    };
  }, [scheduleId]);

  // Auto refresh mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getScheduleStatus = (schedule) => {
    if (!schedule) return { text: 'Không xác định', color: 'gray' };
    if (schedule.TrangThai === 'completed') return { text: 'Đã hoàn thành', color: 'green' };
    if (schedule.TrangThai === 'running') return { text: 'Đang chạy', color: 'blue' };
    return { text: 'Chưa bắt đầu', color: 'orange' };
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const timePart = timeString.split('T')[1] || timeString;
    return timePart.substring(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRefresh = async () => {
    setLastUpdate(new Date());
    // Reload data
    window.location.reload();
  };

  const getAttendanceStatus = (status) => {
    switch (status) {
      case '2': return { text: 'Đã điểm danh', color: 'green', icon: CheckCircle };
      case '1': return { text: 'Vắng có phép', color: 'yellow', icon: AlertTriangle };
      case '0': return { text: 'Chưa điểm danh', color: 'gray', icon: Clock };
      default: return { text: 'Không xác định', color: 'gray', icon: AlertTriangle };
    }
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

  if (!scheduleId || !currentSchedule) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Chưa chọn lịch trình</h2>
          <p className="text-gray-500 mt-2">Vui lòng chọn lịch trình từ trang Dashboard để theo dõi.</p>
        </div>
      </div>
    );
  }

  const status = getScheduleStatus(currentSchedule);
  const currentStopIndex = stops.findIndex(s => s.status === 'pending');
  const currentStop = currentStopIndex >= 0 ? stops[currentStopIndex] : stops[stops.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Theo dõi xe buýt</h1>
            <p className="text-green-100 mt-1">Vị trí và trạng thái xe buýt thời gian thực</p>
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
              <div className="text-sm text-green-100">Cập nhật lần cuối</div>
              <div className="font-medium">{lastUpdate.toLocaleTimeString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bus size={24} className="text-blue-600" />
              {currentSchedule.TenTuyenDuong}
            </h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Xe buýt:</span>
                <span className="ml-2 font-medium text-gray-900">{currentSchedule.BienSo}</span>
              </div>
              <div>
                <span className="text-gray-600">Tài xế:</span>
                <span className="ml-2 font-medium text-gray-900">{currentSchedule.TenTX}</span>
              </div>
              <div>
                <span className="text-gray-600">Ngày chạy:</span>
                <span className="ml-2 font-medium text-gray-900">{formatDate(currentSchedule.NgayChay)}</span>
              </div>
              <div>
                <span className="text-gray-600">Giờ bắt đầu:</span>
                <span className="ml-2 font-medium text-gray-900">{formatTime(currentSchedule.GioBatDau)}</span>
              </div>
              <div>
                <span className="text-gray-600">Giờ kết thúc:</span>
                <span className="ml-2 font-medium text-gray-900">{formatTime(currentSchedule.GioKetThuc)}</span>
              </div>
              <div>
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  status.color === 'green' ? 'bg-green-100 text-green-700' :
                  status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {currentStop && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
              <Navigation size={18} />
              Trạm hiện tại / tiếp theo
            </div>
            <div className="text-gray-900 font-bold">{currentStop.name}</div>
            <div className="text-sm text-gray-600">{currentStop.address}</div>
          </div>
        )}
      </div>

      {/* Map and Route */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <MapPin size={20} />
            Bản đồ lộ trình
          </h2>
        </div>
        <div className="h-[500px]">
          <RouteMap 
            stops={stops}
            currentPosition={busPosition}
          />
        </div>
      </div>

      {/* Route Progress */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Navigation size={20} />
            Tiến trình lộ trình
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stops.map((stop, index) => {
              const isPassed = stop.status === 'completed';
              const isCurrent = index === currentStopIndex;
              
              return (
                <div key={stop.id} className="relative pl-8">
                  {index !== stops.length - 1 && (
                    <div className={`absolute left-[11px] top-7 w-0.5 h-full ${
                      isPassed ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                  
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-white ${
                    isPassed ? 'border-green-500 text-green-500' : 
                    isCurrent ? 'border-blue-500 text-blue-500 animate-pulse' : 
                    'border-gray-300 text-gray-300'
                  }`}>
                    {isPassed ? (
                      <CheckCircle size={14} fill="currentColor" className="text-white"/>
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    )}
                  </div>

                  <div className={`${isCurrent ? 'opacity-100' : 'opacity-60'}`}>
                    <h4 className={`text-sm font-bold ${
                      isCurrent ? 'text-blue-700' : 'text-gray-800'
                    }`}>{stop.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {stop.address}
                      </span>
                      {isCurrent && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Đang đến
                        </span>
                      )}
                      {isPassed && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          Đã qua
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Attendance Status */}
      {myChildren.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <User size={20} />
              Trạng thái điểm danh con em
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {myChildren.map((child) => {
                const studentAttendance = students.find(s => s.id === child.MaHS);
                const attendanceInfo = getAttendanceStatus(studentAttendance?.status || '0');
                const AttendanceIcon = attendanceInfo.icon;
                
                return (
                  <div
                    key={child.MaHS}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                        {child.TenHS?.charAt(0) || 'H'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{child.TenHS}</p>
                        <p className="text-sm text-gray-600">{child.Lop}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {studentAttendance?.stopName || child.TenTram || 'Chưa có trạm'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        attendanceInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                        attendanceInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        <AttendanceIcon size={14} />
                        {attendanceInfo.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
              if (currentSchedule) {
                alert(`Đang gọi cho tài xế ${currentSchedule.TenTX}...`);
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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Navigation, User, Bus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myChildren, setMyChildren] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentData();
  }, [user]);

  const fetchParentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Lấy thông tin phụ huynh
      const parentRes = await axios.get(`${API_URL}/parents/me`, config);
      const parentId = parentRes.data.MaPH;

      // Lấy danh sách con
      const childrenRes = await axios.get(`${API_URL}/parents/me/students`, config);
      setMyChildren(childrenRes.data);

      // Lấy lịch trình hôm nay
      const today = new Date().toISOString().split('T')[0];
      const schedulesRes = await axios.get(`${API_URL}/schedules/by-date?date=${today}`, config);
      
      // Lọc lịch trình liên quan đến con
      const relevantSchedules = schedulesRes.data.filter(schedule => {
        return childrenRes.data.some(child => {
          // Kiểm tra xem trạm của con có trong lịch trình không
          return schedule.MaTD === child.MaTD;
        });
      });
      
      setSchedules(relevantSchedules);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching parent data:', error);
      setLoading(false);
    }
  };



  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Xử lý cả format HH:MM:SS và HH:MM
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

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatDateFull = () => {
    const date = new Date();
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  const getScheduleStatus = (schedule) => {
    const now = new Date();
    const scheduleDate = new Date(schedule.NgayChay);
    const today = new Date().toISOString().split('T')[0];
    const scheduleDay = schedule.NgayChay?.split('T')[0];
    
    if (scheduleDay !== today) return { text: 'Không hoạt động', color: 'gray' };
    if (schedule.TrangThai === 'completed') return { text: 'Đã hoàn thành', color: 'green' };
    if (schedule.TrangThai === 'running') return { text: 'Đang chạy', color: 'blue' };
    return { text: 'Chưa bắt đầu', color: 'orange' };
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Chào {user?.name || 'Phụ huynh'}!</h1>
            <p className="text-green-100 mt-1">Theo dõi hành trình đưa đón con em - {formatDateFull()}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{myChildren.length}</div>
            <div className="text-green-100">Con em</div>
          </div>
        </div>
      </div>



      {/* Children Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myChildren.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl shadow-sm border">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Chưa có thông tin học sinh</p>
          </div>
        ) : (
          myChildren.map((child) => (
            <div key={child.MaHS} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {child.TenHS?.charAt(0) || 'H'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{child.TenHS}</h3>
                  <p className="text-gray-600">{child.Lop}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {child.TenTram || 'Chưa có trạm'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedules Today */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Calendar size={20} />
            Lịch trình hôm nay
          </h2>
        </div>
        <div className="p-4">
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <Bus size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Không có lịch trình nào hôm nay</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => {
                const status = getScheduleStatus(schedule);
                return (
                  <div
                    key={schedule.MaLT}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Bus size={18} />
                          {schedule.TenTuyenDuong}
                        </h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">🚌 Xe:</span>
                            {schedule.BienSo}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">👤 Tài xế:</span>
                            {schedule.TenTX}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock size={14} />
                            <span className="font-medium">{formatTime(schedule.GioBatDau)}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium">{formatTime(schedule.GioKetThuc)}</span>
                          </p>
                          {schedule.NgayChay && (
                            <p className="flex items-center gap-2">
                              <Calendar size={14} />
                              {formatDate(schedule.NgayChay)}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status.color === 'green'
                            ? 'bg-green-100 text-green-700'
                            : status.color === 'blue'
                            ? 'bg-blue-100 text-blue-700'
                            : status.color === 'orange'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {status.text}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/parent-tracking?scheduleId=${schedule.MaLT}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <MapPin size={16} />
                      Theo dõi trên bản đồ
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Status */}
      {myChildren.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle size={20} />
              Trạng thái điểm danh hôm nay
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {myChildren.map((child) => (
                <div
                  key={child.MaHS}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                      {child.TenHS?.charAt(0) || 'H'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{child.TenHS}</p>
                      <p className="text-sm text-gray-600">{child.Lop}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                      <XCircle size={14} />
                      Chưa có dữ liệu
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
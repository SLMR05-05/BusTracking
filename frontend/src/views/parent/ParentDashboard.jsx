import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('[ParentDashboard] Token:', token ? 'exists' : 'missing');
      
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Lấy danh sách học sinh
      console.log('[ParentDashboard] Fetching students...');
      const studentsRes = await axios.get(`${API_URL}/parents/me/students`, config);
      console.log('[ParentDashboard] Students:', studentsRes.data);
      setStudents(studentsRes.data);

      // Lấy lịch trình hôm nay (sử dụng Local date để tránh lệch do timezone UTC)
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      console.log('[ParentDashboard] Fetching schedules for date:', today);
      const schedulesRes = await axios.get(`${API_URL}/schedules/by-date?date=${today}`, config);
      console.log('[ParentDashboard] All schedules:', schedulesRes.data);
      
      // Lọc lịch trình liên quan đến học sinh
      const relevantSchedules = schedulesRes.data.filter(schedule => {
        return studentsRes.data.some(student => {
          const match = schedule.MaTD === student.MaTD;
          console.log(`[ParentDashboard] Comparing schedule ${schedule.MaTD} with student ${student.MaTD}: ${match}`);
          return match;
        });
      });
      
      console.log('[ParentDashboard] Relevant schedules:', relevantSchedules);
      setSchedules(relevantSchedules);
      setLoading(false);
    } catch (error) {
      console.error('[ParentDashboard] Error fetching data:', error);
      console.error('[ParentDashboard] Error response:', error.response?.data);
      console.error('[ParentDashboard] Error status:', error.response?.status);
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const timePart = timeString.split('T')[1] || timeString;
    return timePart.substring(0, 5);
  };

  const parseDateString = (dateString) => {
    if (!dateString) return null;
    // If ISO date or ISO datetime
    if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(dateString)) {
      return new Date(dateString);
    }
    // If dd-mm-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [dd, mm, yyyy] = dateString.split('-');
      return new Date(`${yyyy}-${mm}-${dd}`);
    }
    // Fallback
    const parsed = new Date(dateString);
    return isNaN(parsed) ? null : parsed;
  };

  const formatDate = (dateString) => {
    const date = parseDateString(dateString);
    if (!date) return '';
    return date.toLocaleDateString('vi-VN');
  };

  const getScheduleStatus = (schedule) => {
    const now = new Date();
    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const scheduleDay = (() => {
      if (!schedule?.NgayChay) return null;
      const iso = /^\d{4}-\d{2}-\d{2}/.test(schedule.NgayChay) ? schedule.NgayChay.split('T')[0] : null;
      if (iso) return iso;
      if (/^\d{2}-\d{2}-\d{4}$/.test(schedule.NgayChay)) {
        const [dd, mm, yyyy] = schedule.NgayChay.split('-');
        return `${yyyy}-${mm}-${dd}`;
      }
      // fallback parse
      const d = new Date(schedule.NgayChay);
      if (isNaN(d)) return null;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    
    if (scheduleDay !== todayLocal) return { text: 'Không hoạt động', color: 'gray' };
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow border">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Phụ Huynh</h1>
          <p className="text-gray-600 mt-1">Xin chào, {user?.name || 'Phụ huynh'}</p>
        </div>

        {/* Danh sách học sinh */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Danh sách con em</h2>
          </div>
          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có thông tin học sinh</p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.MaHS} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{student.TenHS}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Lớp:</span>
                            <span className="ml-2">{student.Lop}</span>
                          </div>
                          <div>
                            <span className="font-medium">Trạm:</span>
                            <span className="ml-2">{student.TenTram || 'Chưa có'}</span>
                          </div>
                          {student.TenTuyenDuong && (
                            <div>
                              <span className="font-medium">Tuyến đường:</span>
                              <span className="ml-2">{student.TenTuyenDuong}</span>
                            </div>
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

        {/* Lịch trình hôm nay */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Lịch trình hôm nay</h2>
            <p className="text-sm text-gray-600 mt-1">Các chuyến xe đưa đón</p>
          </div>
          <div className="p-6">
            {schedules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có lịch trình nào hôm nay</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((schedule) => {
                  const status = getScheduleStatus(schedule);
                  return (
                    <div key={schedule.MaLT} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-3">
                            {schedule.TenTuyenDuong}
                          </h3>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Xe:</span>
                              <span className="ml-2">{schedule.BienSo}</span>
                            </div>
                            <div>
                              <span className="font-medium">Tài xế:</span>
                              <span className="ml-2">{schedule.TenTX}</span>
                            </div>
                            <div>
                              <span className="font-medium">Thời gian:</span>
                              <span className="ml-2">
                                {formatTime(schedule.GioBatDau)} - {formatTime(schedule.GioKetThuc)}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Ngày:</span>
                              <span className="ml-2">{formatDate(schedule.NgayChay)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <span
                          className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
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
                        onClick={() => navigate(`/parent-map/${schedule.MaLT}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                      >
                        Xem bản đồ lộ trình
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

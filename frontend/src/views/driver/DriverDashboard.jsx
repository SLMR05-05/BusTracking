import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

import { Clock, Users, CheckCircle, CalendarX, AlertTriangle, MessageSquare } from 'lucide-react';
import IncidentModal from '../../components/driver/IncidentModal';

const API_BASE_URL = 'http://localhost:5000/api/driver-dashboard';

export default function DriverDashboard() {
  const { user, token } = useAuth();
  const { scheduleId } = useParams();

  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Global axios config
  const axiosConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
  }), [token]);

  // --------------------------
  // Tách function fetch lịch chạy
  // --------------------------
  const fetchActiveSchedule = async () => {
    if (!user) return null;

    if (scheduleId) {
      const res = await axios.get(`${API_BASE_URL}/schedules`, axiosConfig);
      return res.data.find(s => String(s.MaLT) === String(scheduleId)) || null;
    }

    // Fallback: Lấy lịch hôm nay
    const offset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - offset).toISOString().split('T')[0];

    const res = await axios.get(`${API_BASE_URL}/schedules?date=${today}`, axiosConfig);
    return res.data[0] || null;
  };

  // --------------------------
  // Tách function fetch students + attendance
  // --------------------------
  const fetchStudentData = async (MaLT) => {
    const [studentsRes, attendanceRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/schedules/${MaLT}/students`, axiosConfig),
      axios.get(`${API_BASE_URL}/schedules/${MaLT}/attendance`, axiosConfig)
    ]);

    return studentsRes.data.map(std => {
      const record = attendanceRes.data.find(r => r.MaHS === std.MaHS);
      return {
        id: std.MaHS,
        name: std.TenHS,
        class: std.Lop,
        stopName: std.TenTram,
        parentName: std.TenPH,
        phone: std.SDT_PH,
        status: record?.TrangThai || '0'
      };
    });
  };

  // --------------------------
  // MAIN USEEFFECT
  // --------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const schedule = await fetchActiveSchedule();
        setCurrentSchedule(schedule);

        if (!schedule) return;

        const studentList = await fetchStudentData(schedule.MaLT);
        setStudents(studentList);
      } catch (error) {
        console.error("Lỗi load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, scheduleId]);

  // --------------------------
  // Toggle điểm danh
  // --------------------------
  const handleStudentCheck = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      const newStatus = student.status === '2' ? '0' : '2';

      await axios.post(
        `${API_BASE_URL}/schedules/${currentSchedule.MaLT}/students/${studentId}/attendance`,
        { status: newStatus },
        axiosConfig
      );

      setStudents(prev =>
        prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s)
      );
    } catch {
      alert("Lỗi cập nhật điểm danh!");
    }
  };

  // --------------------------
  // Gửi báo cáo sự cố
  // --------------------------
  const handleIncidentSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      await axios.post(`${API_BASE_URL}/incidents`, {
        ...data,
        scheduleId: currentSchedule?.MaLT,
        busId: currentSchedule?.MaXB,
      }, axiosConfig);

      alert("Gửi báo cáo thành công!");
      setShowIncidentForm(false);
    } catch {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = students.filter(s => s.status === '2').length;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-blue-600">
        <Clock className="animate-spin mr-2" /> Đang tải...
      </div>
    );

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen relative">
      {/* Modal báo cáo sự cố */}
      <IncidentModal
        isOpen={showIncidentForm}
        onClose={() => setShowIncidentForm(false)}
        onSubmit={handleIncidentSubmit}
        isLoading={isSubmitting}
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Xin chào, {user?.name || 'Tài xế'}!</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Clock size={16} />
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="text-left md:text-right bg-gray-50 p-3 rounded-lg min-w-[200px]">
            <div className="text-xl font-bold text-gray-800">{currentSchedule?.BienSo || '---'}</div>
            <div className="text-sm text-gray-600">{currentSchedule?.TenTuyenDuong || 'Chưa có lịch'}</div>
          </div>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Tổng học sinh</div>
            <div className="text-2xl font-bold text-gray-800">{students.length}</div>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Đã hoàn thành</div>
            <div className="text-2xl font-bold text-gray-800">{completedCount}/{students.length}</div>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Danh sách học sinh */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px] border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-600" size={20} />
              Danh sách đón trả
            </h2>
            {currentSchedule && (
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Mã Lịch: {currentSchedule.MaLT.substring(0, 8)}...
              </span>
            )}
          </div>

          {!currentSchedule ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
              <CalendarX size={64} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">Không có lịch chạy hôm nay</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Chưa có danh sách học sinh.</div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
              {students.map((student) => {
                if (student.id == null) return null;
                const isCompleted = student.status === '2';

                return (
                  <div key={student.id} className="p-4 hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          {student.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.stopName}</div>
                          {student.phone && (
                            <div className="text-xs text-gray-400">PH: {student.parentName} - {student.phone}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStudentCheck(student.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            isCompleted
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <CheckCircle size={16} className={isCompleted ? 'fill-current' : ''} />
                          {isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cột 2: Sidebar (Actions) */}
        <div className="space-y-6">
          {/* Nút Báo cáo sự cố */}
          <div className="bg-yellow-50 rounded-xl shadow-sm p-5 border-2 border-yellow-400 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="text-yellow-600" size={20} />
              Báo cáo sự cố
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              Gửi báo cáo nếu gặp tắc đường, hỏng xe hoặc vấn đề học sinh.
            </p>
            <button
              onClick={() => setShowIncidentForm(true)}
              className="w-full py-2.5 bg-yellow-100 text-yellow-800 font-semibold rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2 border border-yellow-300"
            >
              <MessageSquare size={18} />
              Tạo báo cáo mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// Import Context Authentication
import { useAuth } from '../../contexts/AuthContext'; 

// Import Icons
import { Clock, Users, CheckCircle, CalendarX, AlertTriangle, MessageSquare } from 'lucide-react';

// Import Component
import IncidentModal from '../../components/driver/IncidentModal';

// Cấu hình URL API
const API_BASE_URL = 'http://localhost:5000/api/driver-dashboard'; 

export default function DriverDashboard() {
  const { user, token } = useAuth();
  const { scheduleId } = useParams();
  
  console.log('🚀 [DriverDashboard] Component mounted/updated');
  console.log('👤 [DriverDashboard] User:', user?.username);
  console.log('🆔 [DriverDashboard] scheduleId from params:', scheduleId);
  
  // --- State quản lý dữ liệu ---
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [students, setStudents] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // --- State quản lý UI ---
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. LOAD DỮ LIỆU ---
  useEffect(() => {
    console.log('🔄 [DriverDashboard] useEffect triggered with scheduleId:', scheduleId);
    const fetchData = async () => {
      if (!user) {
        console.log('⚠️ [DriverDashboard] No user, skipping fetch');
        return;
      }
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem('token');
        if (!authToken) { 
          setLoading(false); 
          return; 
        }

        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        
        let activeSchedule;
        
        // Nếu có scheduleId từ URL, lấy lịch cụ thể
        if (scheduleId) {
          console.log('🔍 [DriverDashboard] Fetching schedule with ID:', scheduleId, 'Type:', typeof scheduleId);
          const scheduleRes = await axios.get(`${API_BASE_URL}/schedules`, config);
          console.log('📋 [DriverDashboard] Total schedules:', scheduleRes.data.length);
          console.log('📋 [DriverDashboard] All MaLT values:', scheduleRes.data.map(s => `${s.MaLT} (${typeof s.MaLT})`));
          
          activeSchedule = scheduleRes.data.find(s => {
            const match = String(s.MaLT).trim() === String(scheduleId).trim();
            console.log(`Comparing: "${s.MaLT}" === "${scheduleId}" => ${match}`);
            return match;
          });
          
          if (activeSchedule) {
            console.log('✅ [DriverDashboard] Found schedule:', {
              MaLT: activeSchedule.MaLT,
              TenTuyenDuong: activeSchedule.TenTuyenDuong,
              NgayChay: activeSchedule.NgayChay
            });
          } else {
            console.error('❌ [DriverDashboard] Schedule NOT found for ID:', scheduleId);
            setCurrentSchedule(null); 
            setStudents([]); 
            setLoading(false); 
            return;
          }
        } else {
          console.log('📅 [DriverDashboard] No scheduleId, fetching today\'s schedule');
          // Nếu không có scheduleId, lấy lịch hôm nay (fallback)
          const offset = new Date().getTimezoneOffset() * 60000;
          const dateStr = new Date(Date.now() - offset).toISOString().split('T')[0];
          const scheduleRes = await axios.get(`${API_BASE_URL}/schedules?date=${dateStr}`, config);
          if (!scheduleRes.data || scheduleRes.data.length === 0) {
            setCurrentSchedule(null); setStudents([]); setLoading(false); return;
          }
          activeSchedule = scheduleRes.data[0];
        }
        
        setCurrentSchedule(activeSchedule);

        // Gọi song song lấy DS học sinh và điểm danh
        const [studentsRes, attendanceRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/schedules/${activeSchedule.MaLT}/students`, config),
          axios.get(`${API_BASE_URL}/schedules/${activeSchedule.MaLT}/attendance`, config)
        ]);

        // Mapping dữ liệu
        const processedStudents = studentsRes.data.map(std => {
          const record = attendanceRes.data.find(r => r.MaHS === std.MaHS);
          return {
            id: std.MaHS, name: std.TenHS, class: std.Lop, stopName: std.TenTram,
            parentName: std.TenPH, phone: std.SDT_PH,
            status: record ? record.TrangThai : '0' 
          };
        });
        setStudents(processedStudents);
      } catch (err) {
        console.error("Lỗi tải dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token, scheduleId]);

  // --- 2. XỬ LÝ ĐIỂM DANH (Toggle: Chưa hoàn thành <-> Hoàn thành) ---
  const handleStudentCheck = async (studentId) => {
    if (!currentSchedule) return;
    try {
      const authToken = token || localStorage.getItem('token');
      const student = students.find(s => s.id === studentId);
      const newStatus = student.status === '2' ? '0' : '2'; // Toggle giữa 0 (chưa) và 2 (hoàn thành)
      
      await axios.post(
        `${API_BASE_URL}/schedules/${currentSchedule.MaLT}/students/${studentId}/attendance`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert("Lỗi cập nhật điểm danh!");
    }
  };

  // --- 3. XỬ LÝ GỬI BÁO CÁO SỰ CỐ ---
  const handleIncidentSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const authToken = token || localStorage.getItem('token');
      
      await axios.post(`${API_BASE_URL}/incidents`, {
        ...data,
        scheduleId: currentSchedule?.MaLT || null,
        busId: currentSchedule?.MaXB || null,
      }, { headers: { Authorization: `Bearer ${authToken}` } });

      alert("Gửi báo cáo thành công!");
      setShowIncidentForm(false);
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };



  // --- RENDER UI ---
  const completedCount = students.filter(s => s.status === '2').length;

  if (loading) return <div className="flex justify-center items-center h-screen text-blue-600"><Clock className="animate-spin mr-2"/> Đang tải...</div>;

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
              <Clock size={16}/> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
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
          <div><div className="text-sm text-gray-500">Tổng học sinh</div><div className="text-2xl font-bold text-gray-800">{students.length}</div></div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500 flex justify-between items-center">
          <div><div className="text-sm text-gray-500">Đã hoàn thành</div><div className="text-2xl font-bold text-gray-800">{completedCount}/{students.length}</div></div>
          <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={24} /></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột 1: Danh sách học sinh */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px] border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-600" size={20} /> Danh sách đón trả
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
                 const isPickedUp = student.status === '1';
                 const isDroppedOff = student.status === '2';
                 return (
                  <div key={student.id} className="p-4 hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 
                          ${isDroppedOff ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {student.name?.charAt(0) || 'U'} 
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.stopName}</div>
                          {student.phone && <div className="text-xs text-gray-400">PH: {student.parentName} - {student.phone}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleStudentCheck(student.id)} 
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            isDroppedOff 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <CheckCircle size={16} className={isDroppedOff ? 'fill-current' : ''} />
                          {isDroppedOff ? 'Hoàn thành' : 'Chưa hoàn thành'}
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
                    <AlertTriangle className="text-yellow-600" size={20}/> Báo cáo sự cố
                </h3>
                <p className="text-sm text-yellow-700 mb-3">Gửi báo cáo nếu gặp tắc đường, hỏng xe hoặc vấn đề học sinh.</p>
                <button 
                    onClick={() => setShowIncidentForm(true)}
                    className="w-full py-2.5 bg-yellow-100 text-yellow-800 font-semibold rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2 border border-yellow-300">
                    <MessageSquare size={18} />
                    Tạo báo cáo mới
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
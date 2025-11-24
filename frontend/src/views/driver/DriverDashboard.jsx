import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import Context Authentication
import { useAuth } from '../../contexts/AuthContext'; 

// Import Icons
import { Clock, Users, CheckCircle, Navigation, CalendarX, AlertTriangle, MessageSquare, AlertOctagon } from 'lucide-react';

// Import 2 Components con vừa tách
import IncidentModal from '../../components/driver/IncidentModal';
import EmergencyModal from '../../components/driver/EmergencyModal';

// Cấu hình URL API
const API_BASE_URL = 'http://localhost:5000/api/driver-dashboard'; 

export default function DriverDashboard() {
  const { user, token } = useAuth();
  
  // --- State quản lý dữ liệu ---
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [students, setStudents] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // --- State quản lý UI ---
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. LOAD DỮ LIỆU ---
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem('accessToken');
        if (!authToken) { setLoading(false); return; }

        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        
        // Lấy ngày hiện tại theo múi giờ máy user
        const offset = new Date().getTimezoneOffset() * 60000;
        const dateStr = new Date(Date.now() - offset).toISOString().split('T')[0];

        // Gọi API lấy lịch trình
        const scheduleRes = await axios.get(`${API_BASE_URL}/schedules?date=${dateStr}`, config);

        if (!scheduleRes.data || scheduleRes.data.length === 0) {
          setCurrentSchedule(null); setStudents([]); setLoading(false); return;
        }

        const activeSchedule = scheduleRes.data[0];
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
  }, [user, token]);

  // --- 2. XỬ LÝ ĐIỂM DANH ---
  const handleStudentCheck = async (studentId, action) => {
    if (!currentSchedule) return;
    try {
      const authToken = token || localStorage.getItem('accessToken');
      const statusToSend = action === 'pickup' ? '1' : '2';
      
      await axios.post(
        `${API_BASE_URL}/schedules/${currentSchedule.MaLT}/students/${studentId}/attendance`,
        { status: statusToSend },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: statusToSend } : s));
    } catch (err) {
      alert("Lỗi cập nhật điểm danh!");
    }
  };

  // --- 3. XỬ LÝ GỬI BÁO CÁO SỰ CỐ ---
  const handleIncidentSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const authToken = token || localStorage.getItem('accessToken');
      
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

  // --- 4. XỬ LÝ GỬI SOS ---
  const handleEmergencyConfirm = async () => {
    try {
      setIsSubmitting(true);
      const authToken = token || localStorage.getItem('accessToken');
      
      await axios.post(`${API_BASE_URL}/emergency`, {
        scheduleId: currentSchedule?.MaLT || null,
        type: "SOS_BUTTON"
      }, { headers: { Authorization: `Bearer ${authToken}` } });

      alert("ĐÃ GỬI TÍN HIỆU KHẨN CẤP! HÃY GIỮ BÌNH TĨNH.");
      setShowEmergencyModal(false);
    } catch (error) {
      console.error("Lỗi gửi SOS:", error);
      alert("Không thể gửi tín hiệu! Hãy gọi điện trực tiếp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER UI ---
  const pickedUpCount = students.filter(s => s.status === '1' || s.status === '2').length;
  const droppedOffCount = students.filter(s => s.status === '2').length;

  if (loading) return <div className="flex justify-center items-center h-screen text-blue-600"><Clock className="animate-spin mr-2"/> Đang tải...</div>;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen relative">
      
      {/* Gọi 2 Modal Component tại đây */}
      <IncidentModal 
        isOpen={showIncidentForm} 
        onClose={() => setShowIncidentForm(false)} 
        onSubmit={handleIncidentSubmit}
        isLoading={isSubmitting}
      />
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onConfirm={handleEmergencyConfirm}
        isLoading={isSubmitting}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Xin chào, {user?.name || 'Tài xế'}!</h1>
            <p className="text-blue-200 mt-1 flex items-center gap-2">
              <Clock size={16}/> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="text-left md:text-right bg-white/10 p-3 rounded-lg backdrop-blur-sm min-w-[200px]">
            <div className="text-xl font-bold text-yellow-300">{currentSchedule?.BienSo || '---'}</div>
            <div className="text-sm text-blue-100">{currentSchedule?.TenTuyenDuong || 'Chưa có lịch'}</div>
          </div>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
          <div><div className="text-sm text-gray-500">Tổng học sinh</div><div className="text-2xl font-bold text-gray-800">{students.length}</div></div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500 flex justify-between items-center">
          <div><div className="text-sm text-gray-500">Đã lên xe</div><div className="text-2xl font-bold text-gray-800">{pickedUpCount}/{students.length}</div></div>
          <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={24} /></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500 flex justify-between items-center">
          <div><div className="text-sm text-gray-500">Đã trả</div><div className="text-2xl font-bold text-gray-800">{droppedOffCount}/{students.length}</div></div>
          <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Navigation size={24} /></div>
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
              <p className="text-lg font-medium text-gray-500">Không có lịch trình hôm nay</p>
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
                          ${isDroppedOff ? 'bg-gray-400' : isPickedUp ? 'bg-green-500' : 'bg-blue-500'}`}>
                          {student.name?.charAt(0) || 'U'} 
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.stopName}</div>
                          {student.phone && <div className="text-xs text-gray-400">PH: {student.parentName} - {student.phone}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStudentCheck(student.id, 'pickup')} disabled={isPickedUp || isDroppedOff} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${isPickedUp ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{isPickedUp && <CheckCircle size={14}/>} {isPickedUp ? 'Đã lên' : 'Đón'}</button>
                        <button onClick={() => handleStudentCheck(student.id, 'dropoff')} disabled={!isPickedUp || isDroppedOff} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${isDroppedOff ? 'bg-gray-200 text-gray-600 cursor-default' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>{isDroppedOff && <CheckCircle size={14}/>} {isDroppedOff ? 'Đã trả' : 'Trả'}</button>
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
            <div className="bg-white rounded-xl shadow-sm p-5 border border-orange-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" size={20}/> Báo cáo sự cố
                </h3>
                <p className="text-sm text-gray-500 mb-3">Gửi báo cáo nếu gặp tắc đường, hỏng xe hoặc vấn đề học sinh.</p>
                <button 
                    onClick={() => setShowIncidentForm(true)}
                    className="w-full py-2.5 bg-orange-50 text-orange-700 font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Tạo báo cáo mới
                </button>
            </div>

            {/* Nút Cảnh báo khẩn cấp */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowEmergencyModal(true)} 
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-4 px-4 rounded-xl flex items-center gap-3 border border-red-100 transition-colors font-semibold"
                  >
                    <div className="bg-red-200 p-2 rounded-full">
                      <AlertOctagon size={24} className="text-red-600" />
                    </div>
                    Gửi cảnh báo khẩn cấp
                  </button>
                  
                  <button 
                    onClick={() => alert('Chức năng đang phát triển!')} 
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-xl flex items-center gap-3 border border-blue-100 transition-colors"
                  >
                    <MessageSquare size={20} /> Nhắn tin cho quản lý
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
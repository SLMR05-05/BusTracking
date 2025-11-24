import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Dữ liệu mẫu
const mockChildren = [
  {
    MaHS: 'HS001',
    TenHS: 'Nguyễn Văn An',
    Lop: '10A1',
    TenTram: 'Trạm Lê Lợi',
    TenTuyenDuong: 'Tuyến 1 - Quận 1'
  },
  {
    MaHS: 'HS002',
    TenHS: 'Nguyễn Thị Bình',
    Lop: '8A2',
    TenTram: 'Trạm Nguyễn Huệ',
    TenTuyenDuong: 'Tuyến 1 - Quận 1'
  }
];

const mockSchedules = [
  {
    MaLT: 'LT001',
    TenTuyenDuong: 'Tuyến 1 - Quận 1 → Trường THPT Thực Hành',
    BienSo: '51A-12345',
    TenTX: 'Trần Văn Tài',
    NgayChay: new Date().toISOString(),
    GioBatDau: '07:00:00',
    GioKetThuc: '08:00:00',
    TrangThai: 'running',
    MaTD: 'TD001'
  },
  {
    MaLT: 'LT002',
    TenTuyenDuong: 'Tuyến 1 - Trường THPT ABC → Quận 1',
    BienSo: '51A-12345',
    TenTX: 'Trần Văn Tài',
    NgayChay: new Date().toISOString(),
    GioBatDau: '16:30:00',
    GioKetThuc: '17:30:00',
    TrangThai: 'pending',
    MaTD: 'TD001'
  }
];

export default function ParentHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setChildren(mockChildren);
      setTodaySchedules(mockSchedules);
      setLoading(false);
    }, 500);
  }, []);

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

  const getScheduleStatus = (schedule) => {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trang chủ phụ huynh</h1>
          <p className="text-gray-600">Theo dõi hành trình đưa đón con em</p>
        </div>

        {/* Children Cards */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Danh sách con em</h2>
          {children.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Chưa có thông tin học sinh</p>
            </div>
          ) : (
            <div className="space-y-4">
              {children.map((child) => (
                <div key={child.MaHS} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{child.TenHS}</h3>
                      <p className="text-gray-600 text-sm mb-2">Lớp: {child.Lop}</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Trạm:</span>
                          <span className="ml-2">{child.TenTram || 'Chưa có'}</span>
                        </div>
                        {child.TenTuyenDuong && (
                          <div>
                            <span className="font-medium">Tuyến:</span>
                            <span className="ml-2">{child.TenTuyenDuong}</span>
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

        {/* Today's Schedules */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Lịch trình hôm nay</h2>
            <p className="text-gray-600 text-sm mt-1">Theo dõi các chuyến xe đưa đón con em</p>
          </div>
          
          <div className="p-6">
            {todaySchedules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có lịch trình nào hôm nay</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedules.map((schedule) => {
                  const status = getScheduleStatus(schedule);
                  return (
                    <div
                      key={schedule.MaLT}
                      className="border rounded-lg p-4"
                    >
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
                              <span className="ml-2">{formatTime(schedule.GioBatDau)} - {formatTime(schedule.GioKetThuc)}</span>
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
                        onClick={() => navigate(`/parent-live-tracking?scheduleId=${schedule.MaLT}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                      >
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
        {children.length > 0 && (
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Trạng thái điểm danh hôm nay</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {children.map((child) => (
                  <div
                    key={child.MaHS}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{child.TenHS}</p>
                      <p className="text-sm text-gray-600">{child.Lop}</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700">
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
    </div>
  );
}

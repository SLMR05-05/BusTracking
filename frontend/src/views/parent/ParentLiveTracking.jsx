import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import RouteMap from '../../components/RouteMap';

// Dữ liệu mẫu
const mockChildren = [
  {
    MaHS: 'HS001',
    TenHS: 'Nguyễn Văn An',
    Lop: '10A1',
    TenTram: 'Trạm Lê Lợi'
  },
  {
    MaHS: 'HS002',
    TenHS: 'Nguyễn Thị Bình',
    Lop: '8A2',
    TenTram: 'Trạm Nguyễn Huệ'
  }
];

const mockSchedule = {
  MaLT: 'LT001',
  TenTuyenDuong: 'Tuyến 1 - Quận 1 → Trường THPT ABC',
  BienSo: '51A-12345',
  TenTX: 'Trần Văn Tài',
  NgayChay: new Date().toISOString(),
  GioBatDau: '07:00:00',
  GioKetThuc: '08:00:00',
  TrangThai: 'running'
};

const mockStops = [
  {
    id: 'T001',
    detailId: 'CT001',
    name: 'Trạm Lê Lợi',
    address: '123 Lê Lợi, Quận 1',
    lat: 10.7769,
    lng: 106.7009,
    order: 1,
    status: 'completed'
  },
  {
    id: 'T002',
    detailId: 'CT002',
    name: 'Trạm Nguyễn Huệ',
    address: '456 Nguyễn Huệ, Quận 1',
    lat: 10.7745,
    lng: 106.7035,
    order: 2,
    status: 'pending'
  },
  {
    id: 'T003',
    detailId: 'CT003',
    name: 'Trạm Đồng Khởi',
    address: '789 Đồng Khởi, Quận 1',
    lat: 10.7721,
    lng: 106.7050,
    order: 3,
    status: 'pending'
  },
  {
    id: 'T004',
    detailId: 'CT004',
    name: 'Trường THPT ABC',
    address: '321 Pasteur, Quận 3',
    lat: 10.7697,
    lng: 106.6920,
    order: 4,
    status: 'pending'
  }
];

const mockStudents = [
  {
    id: 'HS001',
    name: 'Nguyễn Văn An',
    class: '10A1',
    stopId: 'T001',
    stopName: 'Trạm Lê Lợi',
    status: '2'
  },
  {
    id: 'HS002',
    name: 'Nguyễn Thị Bình',
    class: '8A2',
    stopId: 'T002',
    stopName: 'Trạm Nguyễn Huệ',
    status: '0'
  }
];

const mockBusPosition = {
  lat: 10.7755,
  lng: 106.7022
};

export default function ParentLiveTracking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');
  
  const [children] = useState(mockChildren);
  const [schedule] = useState(mockSchedule);
  const [stops] = useState(mockStops);
  const [students] = useState(mockStudents);
  const [busPosition] = useState(mockBusPosition);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
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
    return date.toLocaleDateString('vi-VN');
  };

  const getScheduleStatus = () => {
    if (!schedule) return { text: 'Không xác định', color: 'gray' };
    if (schedule.TrangThai === 'completed') return { text: 'Đã hoàn thành', color: 'green' };
    if (schedule.TrangThai === 'running') return { text: 'Đang chạy', color: 'blue' };
    return { text: 'Chưa bắt đầu', color: 'orange' };
  };

  const getAttendanceStatus = (status) => {
    switch (status) {
      case '2': return { text: 'Đã điểm danh', color: 'green' };
      case '1': return { text: 'Vắng có phép', color: 'yellow' };
      case '0': return { text: 'Chưa điểm danh', color: 'gray' };
      default: return { text: 'Không xác định', color: 'gray' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-8xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy lịch trình</h2>
          <p className="text-gray-500 mb-6">Vui lòng chọn lịch trình từ trang chủ</p>
          <button
            onClick={() => navigate('/parent-home')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const status = getScheduleStatus();
  const currentStopIndex = stops.findIndex(s => s.status === 'pending');
  const currentStop = currentStopIndex >= 0 ? stops[currentStopIndex] : stops[stops.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/parent-home')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Quay lại
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Làm mới
              </button>
              <div className="text-right text-sm text-gray-600">
                <div>Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Theo dõi xe buýt</h1>
            <p className="text-gray-600 mt-1">Vị trí và trạng thái xe buýt</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Schedule Info */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {schedule.TenTuyenDuong}
              </h2>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Xe buýt:</span>
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
              </div>
            </div>
            
            <span
              className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
                status.color === 'green' ? 'bg-green-100 text-green-700' :
                status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}
            >
              {status.text}
            </span>
          </div>

          {currentStop && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-blue-900 font-medium mb-2">
                Trạm hiện tại / tiếp theo
              </div>
              <div className="text-gray-900 font-bold">{currentStop.name}</div>
              <div className="text-sm text-gray-600">{currentStop.address}</div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Bản đồ lộ trình</h2>
          </div>
          <div className="h-[500px]">
            <RouteMap 
              stops={stops}
              currentPosition={busPosition}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Route Progress */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Tiến trình lộ trình</h2>
            </div>
            <div className="p-6 max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {stops.map((stop, index) => {
                  const isPassed = stop.status === 'completed';
                  const isCurrent = index === currentStopIndex;
                  
                  return (
                    <div key={stop.id} className="relative pl-8">
                      {index !== stops.length - 1 && (
                        <div className={`absolute left-[11px] top-6 w-0.5 h-full ${
                          isPassed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                      
                      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center z-10 bg-white border-2 ${
                        isPassed ? 'border-green-500' : 
                        isCurrent ? 'border-blue-500' : 
                        'border-gray-300'
                      }`}>
                        {isPassed && (
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        )}
                        {isCurrent && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>

                      <div>
                        <h4 className={`font-medium text-sm ${
                          isCurrent ? 'text-blue-700' : 'text-gray-900'
                        }`}>{stop.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {stop.address}
                          </span>
                          {isCurrent && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              Đang đến
                            </span>
                          )}
                          {isPassed && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
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

          {/* Student Attendance */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Trạng thái điểm danh con em</h2>
            </div>
            <div className="p-6 max-h-[500px] overflow-y-auto">
              {children.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không có thông tin học sinh</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {children.map((child) => {
                    const studentAttendance = students.find(s => s.id === child.MaHS);
                    const attendanceInfo = getAttendanceStatus(studentAttendance?.status || '0');
                    
                    return (
                      <div
                        key={child.MaHS}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div>
                          <p className="font-bold text-gray-900">{child.TenHS}</p>
                          <p className="text-sm text-gray-600">{child.Lop}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Trạm: {studentAttendance?.stopName || child.TenTram || 'Chưa có'}
                          </p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded text-xs font-medium ${
                            attendanceInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                            attendanceInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {attendanceInfo.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Liên hệ nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => alert('Đang gọi cho nhà trường...')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors text-sm font-medium"
            >
              Gọi cho nhà trường
            </button>
            <button
              onClick={() => alert(`Đang gọi cho tài xế ${schedule.TenTX}...`)}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors text-sm font-medium"
            >
              Gọi cho tài xế
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
